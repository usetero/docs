#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DEFAULT_BASE_URL =
  process.env.TERO_SCREENSHOT_BASE_URL || "https://demo.usetero.com";
const DEMO_BASE_URL =
  process.env.TERO_SCREENSHOT_DEMO_BASE_URL || "https://demo.usetero.com";

const DESKTOP_VIEWPORT = { width: 1440, height: 1000 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

const SUGGESTION_RE =
  /(?:\{\/\*|<!--) screenshot-suggestion\n([\s\S]*?)\n(?:\*\/\}|-->)/g;

const REQUIRED_FIELDS = [
  "id",
  "priority",
  "appRoute",
  "viewport",
  "state",
  "output",
  "caption",
  "purpose",
];

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

async function main() {
  const files = args.files.length > 0 ? args.files : await findMdxFiles(ROOT);
  const suggestions = [];

  for (const file of files) {
    const absoluteFile = path.resolve(ROOT, file);
    const text = await readFile(absoluteFile, "utf8");
    suggestions.push(...parseSuggestions(text, absoluteFile));
  }

  const selected = suggestions
    .filter((suggestion) => !args.ids.size || args.ids.has(suggestion.id))
    .slice(0, args.limit ?? suggestions.length);

  if (selected.length === 0) {
    console.log("No screenshot suggestions matched.");
    return;
  }

  printPlan(selected);

  let completed = selected;

  if (!args.embedOnly && !args.dryRun) {
    completed = await captureSuggestions(selected);
  }

  if (!args.captureOnly && !args.dryRun) {
    await embedSuggestions(completed);
  }
}

function parseArgs(argv) {
  const parsed = {
    baseUrl: DEFAULT_BASE_URL,
    captureOnly: false,
    dryRun: false,
    embedOnly: false,
    files: [],
    headed: false,
    ids: new Set(),
    limit: undefined,
    skipErrors: false,
    waitMs: 1200,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") continue;
    else if (arg === "--base-url") parsed.baseUrl = requiredValue(argv, ++i, arg);
    else if (arg === "--capture-only") parsed.captureOnly = true;
    else if (arg === "--dry-run") parsed.dryRun = true;
    else if (arg === "--embed-only") parsed.embedOnly = true;
    else if (arg === "--file") parsed.files.push(requiredValue(argv, ++i, arg));
    else if (arg === "--headed") parsed.headed = true;
    else if (arg === "--id") parsed.ids.add(requiredValue(argv, ++i, arg));
    else if (arg === "--limit")
      parsed.limit = Number.parseInt(requiredValue(argv, ++i, arg), 10);
    else if (arg === "--skip-errors") parsed.skipErrors = true;
    else if (arg === "--wait-ms")
      parsed.waitMs = Number.parseInt(requiredValue(argv, ++i, arg), 10);
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      parsed.files.push(arg);
    }
  }

  if (Number.isNaN(parsed.limit)) throw new Error("--limit must be a number");
  if (Number.isNaN(parsed.waitMs)) throw new Error("--wait-ms must be a number");
  return parsed;
}

function requiredValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function printHelp() {
  console.log(`Usage:
  node scripts/screenshot-suggestions.mjs [options]

Options:
  --base-url <url>     App host to scrape (default: ${DEFAULT_BASE_URL})
  --file <path>        MDX file to process. Can be repeated.
  --id <id>            Screenshot suggestion id to process. Can be repeated.
  --limit <n>          Process the first n matching suggestions.
  --wait-ms <n>        Wait after route load before capture (default: 1200).
  --skip-errors        Continue when a route fails or renders an app error.
  --dry-run            Print the capture plan without writing files.
  --embed-only         Insert/update image embeds without capturing screenshots.
  --capture-only       Capture screenshots without modifying MDX files.
  --headed             Show Chromium while capturing.

Examples:
  pnpm screenshots -- --dry-run
  pnpm screenshots -- --id issues-overview-workspace
  TERO_SCREENSHOT_BASE_URL=http://localhost:5173 pnpm screenshots
`);
}

async function findMdxFiles(directory) {
  const entries = await import("node:fs/promises").then((fs) =>
    fs.readdir(directory, { withFileTypes: true }),
  );
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (["node_modules", ".git", ".hermit"].includes(entry.name)) continue;

    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMdxFiles(absolute)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(path.relative(ROOT, absolute));
    }
  }

  return files.sort();
}

function parseSuggestions(text, file) {
  const suggestions = [];
  for (const match of text.matchAll(SUGGESTION_RE)) {
    const fields = parseFields(match[1]);
    const missing = REQUIRED_FIELDS.filter((field) => !fields[field]);
    if (missing.length > 0) {
      throw new Error(
        `${path.relative(ROOT, file)} has an incomplete screenshot suggestion: ${missing.join(", ")}`,
      );
    }

    suggestions.push({
      ...fields,
      file,
      blockEnd: match.index + match[0].length,
      blockStart: match.index,
      demoUrl: new URL(fields.appRoute, normalizedBaseUrl(DEMO_BASE_URL)).toString(),
      url: new URL(fields.appRoute, normalizedBaseUrl(args.baseUrl)).toString(),
      outputPath: path.resolve(ROOT, fields.output.replace(/^\//, "")),
    });
  }
  return suggestions;
}

function parseFields(block) {
  const fields = {};
  for (const line of block.split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    fields[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return fields;
}

function normalizedBaseUrl(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

function printPlan(suggestions) {
  console.log(
    `${args.dryRun ? "Would process" : "Processing"} ${suggestions.length} screenshot suggestion(s):`,
  );

  for (const suggestion of suggestions) {
    console.log(
      `- ${suggestion.id}: ${suggestion.url} -> ${path.relative(ROOT, suggestion.outputPath)}`,
    );
  }
}

async function captureSuggestions(suggestions) {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: !args.headed });
  const completed = [];

  try {
    for (const suggestion of suggestions) {
      try {
        await captureSuggestion(browser, suggestion);
        completed.push(suggestion);
      } catch (error) {
        if (!args.skipErrors) throw error;
        console.warn(`Skipping ${suggestion.id}: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  return completed;
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    throw new Error(
      [
        "Playwright is required to capture screenshots.",
        "Install it with:",
        "  pnpm add -D playwright",
        "  pnpm exec playwright install chromium",
        "",
        "You can still run --dry-run or --embed-only without Playwright.",
      ].join("\n"),
      { cause: error },
    );
  }
}

async function captureSuggestion(browser, suggestion) {
  const viewport =
    suggestion.viewport === "mobile" ? MOBILE_VIEWPORT : DESKTOP_VIEWPORT;
  const page = await browser.newPage({ viewport });

  try {
    console.log(`Capturing ${suggestion.id} (${suggestion.state})`);
    await page.goto(suggestion.url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(args.waitMs);
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          caret-color: transparent !important;
        }
      `,
    });

    await assertNoAppError(page, suggestion);

    await mkdir(path.dirname(suggestion.outputPath), { recursive: true });

    if (suggestion.selector) {
      const locator = page.locator(suggestion.selector).first();
      await locator.waitFor({ state: "visible", timeout: 10_000 });
      await locator.screenshot({ path: suggestion.outputPath });
    } else {
      await page.screenshot({
        path: suggestion.outputPath,
        fullPage: false,
      });
    }
  } finally {
    await page.close();
  }
}

async function assertNoAppError(page, suggestion) {
  const bodyText = await page.locator("body").innerText({ timeout: 5_000 });
  const appErrorMarkers = [
    "Something went wrong",
    "Try again in a moment",
    "The server returned status",
  ];

  if (appErrorMarkers.some((marker) => bodyText.includes(marker))) {
    throw new Error(
      `${suggestion.id} rendered an app error at ${suggestion.url}. Update the appRoute/state or rerun with --skip-errors.`,
    );
  }

  const visibleText = bodyText.replace(/\s+/g, " ").trim();
  if (visibleText.length < 80) {
    throw new Error(
      `${suggestion.id} rendered a mostly blank page at ${suggestion.url}. Increase --wait-ms or update the appRoute/state.`,
    );
  }
}

async function embedSuggestions(suggestions) {
  const byFile = new Map();
  for (const suggestion of suggestions) {
    const group = byFile.get(suggestion.file) || [];
    group.push(suggestion);
    byFile.set(suggestion.file, group);
  }

  for (const [file, fileSuggestions] of byFile) {
    let text = await readFile(file, "utf8");
    const reparsed = parseSuggestions(text, file).filter((suggestion) =>
      fileSuggestions.some((selected) => selected.id === suggestion.id),
    );

    for (const suggestion of reparsed.sort((a, b) => b.blockEnd - a.blockEnd)) {
      const embed = renderEmbed(suggestion);
      const after = text.slice(suggestion.blockEnd);
      const generatedRe = new RegExp(
        `^\\n*\\{\\/\\* screenshot-generated id: ${escapeRegExp(suggestion.id)} \\*\\/\\}\\n[\\s\\S]*?\\n\\{\\/\\* \\/screenshot-generated \\*\\/\\}`,
      );
      const match = after.match(generatedRe);

      if (match) {
        text =
          text.slice(0, suggestion.blockEnd) +
          `\n\n${embed}` +
          after.slice(match[0].length);
      } else {
        text =
          text.slice(0, suggestion.blockEnd) +
          `\n\n${embed}` +
          text.slice(suggestion.blockEnd);
      }
    }

    await writeFile(file, text);
  }
}

function renderEmbed(suggestion) {
  return [
    `{/* screenshot-generated id: ${suggestion.id} */}`,
    "<Frame>",
    `  <img src="${suggestion.output}" alt="${escapeAttribute(
      suggestion.caption,
    )}" />`,
    "</Frame>",
    `<p className="screenshot-caption"><small>${escapeHtml(
      suggestion.caption,
    )} <a className="demo-screenshot-link" href="${escapeAttribute(
      suggestion.demoUrl,
    )}" target="_blank" rel="noopener noreferrer">Open in demo <Icon icon="arrow-up-right-from-square" /></a></small></p>`,
    "{/* /screenshot-generated */}",
  ].join("\n");
}

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
