# Demo Video Pipeline

This directory owns deterministic product walkthrough video generation for the docs.

The production path is scripted and CI-friendly:

1. Read a walkthrough YAML file.
2. Capture browser footage with Playwright and stable `data-demo-id` selectors.
3. Extract narration, generate or stub voiceover audio, and create captions.
4. Stage artifacts into `public/videos/<walkthrough-id>/`.
5. Render an MP4 and poster with Remotion.

AI/browser agents can help author or QA walkthroughs, but the render path must not rely on a live agent clicking through the UI.

## Codex-local workflow

Codex can run this locally with your existing Codex CLI sign-in:

```bash
codex login
pnpm video:cost-walkthrough
pnpm video:codex:qa -- cost-walkthrough
```

Use Codex for authoring and QA, not for production clicking. The `video:codex:qa` command runs `codex exec` over the walkthrough YAML and generated artifacts, then writes `demo-videos/output/<id>/codex-qa.md`.

Your Codex CLI or ChatGPT subscription does not act as a general OpenAI API key for scripts. OpenAI speech generation still requires `OPENAI_API_KEY`. On macOS, the voice step automatically uses the local `say` tool when no API key is present. You can also request it explicitly:

```bash
DEMO_VIDEO_TTS_PROVIDER=macos pnpm video:voice -- cost-walkthrough
```

Without `OPENAI_API_KEY` or an available local macOS speech tool, the voice step writes deterministic placeholder silence.

## Walkthrough YAML

Walkthroughs live in `demo-videos/walkthroughs/`. Each file defines the demo URL, viewport, voice settings, and ordered scenes. Browser scenes support these deterministic steps:

- `waitFor`: wait for a selector to be visible.
- `click`: click a selector.
- `spotlight`: record a selector bounding box for a callout overlay.
- `pause`: wait a fixed number of seconds.
- `fill`: fill a selector with text.
- `press`: press a keyboard key on a selector.

The canonical walkthrough is `demo-videos/walkthroughs/cost-walkthrough.yaml`.

## Demo Selectors

The demo site should prefer stable `data-demo-id` attributes for new flows. The current `cost-walkthrough` walkthrough starts with existing production DOM on the hosted demo and uses these selectors:

- `a[href="/cost"][aria-label^="Cost,"]`
- `a[href="/issues?statusTab=open&view=cost&severity=high"]`
- `section[aria-label="Issues"]`
- `button[aria-label^="ISS-1:"]`
- `button[aria-label="Deploy policy from issue footer"]`

The hosted demo starts at `https://demo.usetero.com/`, then the walkthrough clicks through the app navigation to `/cost` before opening the filtered cost issue queue. If this flow becomes permanent, add explicit `data-demo-id` attributes in the app and update the YAML to use those instead of ARIA/text-derived selectors.

## Local Commands

Install dependencies and Playwright Chromium:

```bash
pnpm install
pnpm exec playwright install chromium
```

Run the full `cost-walkthrough` pipeline:

```bash
DEMO_BASE_URL=http://localhost:5173 pnpm video:cost-walkthrough
```

Use the hosted demo instead:

```bash
DEMO_BASE_URL=https://demo.usetero.com pnpm video:cost-walkthrough
```

Run individual steps:

```bash
pnpm video:extract -- cost-walkthrough
pnpm video:capture -- cost-walkthrough
pnpm video:voice -- cost-walkthrough
pnpm video:captions -- cost-walkthrough
pnpm video:render -- cost-walkthrough
```

Outputs are written to `demo-videos/output/<id>/`. Rendered assets are staged under `public/videos/<id>/`, with final docs assets at:

- `public/videos/<id>.mp4`
- `public/videos/<id>-poster.png`

Intermediate capture and render assets are ignored by git by default. Commit the final MP4 and poster when a docs page embeds them.

## Voiceover

Set `OPENAI_API_KEY` to generate narrated audio with the OpenAI speech API:

```bash
OPENAI_API_KEY=... pnpm video:voice -- cost-walkthrough
```

Without `OPENAI_API_KEY`, the voice step writes deterministic placeholder silence and a note explaining what is missing. This keeps local and CI runs resilient when secrets are unavailable.

On macOS, the script uses local system speech to create `voiceover.wav` when no `OPENAI_API_KEY` is present. Set `DEMO_VIDEO_TTS_PROVIDER=macos` to force that path, or `DEMO_VIDEO_TTS_PROVIDER=placeholder` to force deterministic placeholder silence. If local speech is blocked or unavailable, the script falls back to placeholder silence.

### Local Chatterbox TTS

Install Resemble AI Chatterbox into a repo-local `uv` environment:

```bash
pnpm video:install-chatterbox
```

Generate scene voiceover with the local model:

```bash
DEMO_VIDEO_TTS_PROVIDER=chatterbox pnpm video:voice -- cost-walkthrough
```

The provider writes per-scene `voiceover-<scene>.wav` files and a `voiceover.json` manifest, so capture timing and Remotion rendering work the same way as the OpenAI and macOS providers. On macOS, the provider uses the `Samantha` system voice as a local reference prompt by default so Chatterbox produces a more professional female voice.

Optional Chatterbox settings:

- `DEMO_VIDEO_CHATTERBOX_MODEL=standard|turbo|multilingual`
- `DEMO_VIDEO_CHATTERBOX_DEVICE=auto|cuda|mps|cpu`
- `DEMO_VIDEO_CHATTERBOX_AUDIO_PROMPT=/path/to/reference.wav`
- `DEMO_VIDEO_CHATTERBOX_MACOS_VOICE=Samantha`
- `DEMO_VIDEO_CHATTERBOX_DISABLE_MACOS_PROMPT=1`
- `DEMO_VIDEO_CHATTERBOX_LANGUAGE_ID=en`
- `DEMO_VIDEO_CHATTERBOX_EXAGGERATION=0.5`
- `DEMO_VIDEO_CHATTERBOX_CFG_WEIGHT=0.5`
- `DEMO_VIDEO_CHATTERBOX_TEMPERATURE=0.8`

## Adding a Walkthrough

1. Copy `demo-videos/walkthroughs/cost-walkthrough.yaml`.
2. Give it a unique `id`, globally clear `title`, and scene IDs.
3. Add stable `data-demo-id` attributes to the demo app for every action and callout.
4. Run `pnpm video:extract`, `pnpm video:capture`, `pnpm video:voice`, `pnpm video:captions`, and `pnpm video:render`.
5. Embed the final MP4 in the relevant MDX page:

```mdx
<video
  controls
  playsInline
  poster="/videos/<id>-poster.png"
  src="/videos/<id>.mp4"
/>
```

## CI Notes

The included GitHub Actions workflow installs dependencies, installs Playwright Chromium, runs the pipeline, and uploads `public/videos` as an artifact. It does not commit generated MP4s back to the repository.
