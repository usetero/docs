#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VENV_DIR="${DEMO_VIDEO_CHATTERBOX_VENV:-"$ROOT_DIR/demo-videos/.venv-chatterbox"}"
PYTHON_VERSION="${DEMO_VIDEO_CHATTERBOX_PYTHON_VERSION:-3.11}"
PACKAGE="${DEMO_VIDEO_CHATTERBOX_PACKAGE:-chatterbox-tts}"
UV_BIN="${UV:-uv}"

echo "Creating Chatterbox environment at $VENV_DIR"
"$UV_BIN" venv --python "$PYTHON_VERSION" "$VENV_DIR"

echo "Installing $PACKAGE"
"$UV_BIN" pip install --python "$VENV_DIR/bin/python" "$PACKAGE"

"$VENV_DIR/bin/python" - <<'PY'
import torch
import torchaudio
from chatterbox.tts import ChatterboxTTS

if torch.cuda.is_available():
    device = "cuda"
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    device = "mps"
else:
    device = "cpu"

print(f"Chatterbox import OK; preferred device: {device}")
print(f"torchaudio: {torchaudio.__version__}")
print(f"model class: {ChatterboxTTS.__name__}")
PY

echo "Done. Use DEMO_VIDEO_TTS_PROVIDER=chatterbox pnpm video:voice -- cost-walkthrough"
