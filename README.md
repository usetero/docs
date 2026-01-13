# Tero Documentation

This repository contains Tero's public documentation, built with
[Mintlify](https://mintlify.com).

## What's Here

Customer-facing documentation covering:

- How Tero works
- Integration guides
- CLI and Edge reference
- Security and compliance

## Contributing

We welcome contributions from customers and the community. If you spot errors,
unclear explanations, or missing information, please open an issue or submit a
pull request.

Follow the writing style in `docs/` (internal planning docs) and maintain the
progressive structure outlined there.

## Development

Install the Mintlify CLI to preview changes locally:

```bash
npm i -g mint
```

Run the dev server from the root directory:

```bash
mint dev
```

View your local preview at `http://localhost:3000`.

## Publishing

Changes pushed to the main branch are automatically deployed to production via
the Mintlify GitHub app.

## Structure

- **MDX files** - Documentation pages
- **docs.json** - Navigation configuration
- **docs/** - Internal planning and organization docs (not published)
- **snippets/** - Reusable content blocks

## Need Help?

- [Tero Support](mailto:support@usetero.com)
- [Mintlify Documentation](https://mintlify.com/docs)
