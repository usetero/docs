#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Generate demo video voiceover audio with Chatterbox.")
    parser.add_argument("--input", required=True, help="Path to narration-scenes.json.")
    parser.add_argument("--output-dir", required=True, help="Directory to write voiceover files into.")
    parser.add_argument("--model", choices=["standard", "turbo", "multilingual"], default="standard")
    parser.add_argument("--device", default="auto", help="auto, cuda, mps, or cpu.")
    parser.add_argument("--audio-prompt", help="Optional reference WAV for voice cloning.")
    parser.add_argument("--language-id", default="en", help="Language ID for multilingual model.")
    parser.add_argument("--exaggeration", type=float, default=0.5)
    parser.add_argument("--cfg-weight", type=float, default=0.5)
    parser.add_argument("--temperature", type=float, default=0.8)
    args = parser.parse_args()

    try:
        import torch
        import torchaudio as ta
    except ImportError as error:
        raise SystemExit(
            "Missing Chatterbox dependencies. Run `pnpm video:install-chatterbox` first."
        ) from error

    device = resolve_device(torch, args.device)
    patch_torch_load_for_local_device(torch, device)
    patch_perth_watermarker()

    model = load_model(args.model, device)
    scenes = json.loads(Path(args.input).read_text())
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    files = []
    for scene in scenes:
        scene_id = scene["sceneId"]
        text = scene["text"]
        file_name = f"voiceover-{safe_file_part(scene_id)}.wav"
        output_path = output_dir / file_name
        wav = generate(model, args.model, text, args)
        ta.save(str(output_path), wav, model.sr)
        files.append(
            {
                "sceneId": scene_id,
                "file": file_name,
                "duration": wav.shape[-1] / model.sr,
            }
        )
        print(f"Wrote {output_path}")

    manifest = {"mode": "scene", "files": files}
    (output_dir / "voiceover.json").write_text(json.dumps(manifest, indent=2) + "\n")


def resolve_device(torch, requested):
    if requested != "auto":
        return requested
    if torch.cuda.is_available():
        return "cuda"
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def patch_torch_load_for_local_device(torch, device):
    if device not in {"cpu", "mps"}:
        return

    map_location = torch.device(device)
    original_torch_load = torch.load

    def patched_torch_load(*args, **kwargs):
        kwargs.setdefault("map_location", map_location)
        return original_torch_load(*args, **kwargs)

    torch.load = patched_torch_load


def patch_perth_watermarker():
    try:
        import perth
    except ImportError:
        return

    if getattr(perth, "PerthImplicitWatermarker", None) is None:
        perth.PerthImplicitWatermarker = perth.DummyWatermarker


def load_model(model_name, device):
    if model_name == "turbo":
        from chatterbox.tts_turbo import ChatterboxTurboTTS

        return ChatterboxTurboTTS.from_pretrained(device=device)
    if model_name == "multilingual":
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS

        return ChatterboxMultilingualTTS.from_pretrained(device=device, t3_model="v3")

    from chatterbox.tts import ChatterboxTTS

    return ChatterboxTTS.from_pretrained(device=device)


def generate(model, model_name, text, args):
    kwargs = {"temperature": args.temperature}
    if args.audio_prompt:
        kwargs["audio_prompt_path"] = args.audio_prompt

    if model_name == "multilingual":
        kwargs["language_id"] = args.language_id
        kwargs["exaggeration"] = args.exaggeration
        kwargs["cfg_weight"] = args.cfg_weight
    elif model_name == "turbo":
        kwargs["exaggeration"] = args.exaggeration
        kwargs["cfg_weight"] = args.cfg_weight
    else:
        kwargs["exaggeration"] = args.exaggeration
        kwargs["cfg_weight"] = args.cfg_weight

    return model.generate(text, **kwargs)


def safe_file_part(value):
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9-]+", "-", value, flags=re.I)).lower()


if __name__ == "__main__":
    main()
