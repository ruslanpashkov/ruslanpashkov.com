# Ruslan Pashkov's Website

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Lint](https://github.com/ruslanpashkov/ruslanpashkov.com/actions/workflows/lint.yml/badge.svg)](https://github.com/ruslanpashkov/ruslanpashkov.com/actions/workflows/lint.yml)
[![Test](https://github.com/ruslanpashkov/ruslanpashkov.com/actions/workflows/test.yml/badge.svg)](https://github.com/ruslanpashkov/ruslanpashkov.com/actions/workflows/test.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/3636665e-3793-40ea-9632-ac79a4edba44/deploy-status)](https://app.netlify.com/sites/ruslanpashkov/deploys)

This is the source code for my personal website, [ruslanpashkov.com](https://ruslanpashkov.com). It's built with [Astro](https://astro.build), a static site generator, and hosted on [Netlify](https://www.netlify.com). Powered by [Bun](https://bun.sh) as the JavaScript runtime and package manager.

## Installation

0. Install [Bun](https://bun.sh) if you haven't already

1. Clone the repository

   ```bash
   git clone https://github.com/ruslanpashkov/ruslanpashkov.com.git
   ```

2. Install dependencies

   ```bash
   cd ruslanpashkov.com
   bun install
   ```

## Scripts

- `bun run astro`: Run Astro CLI commands directly
- `bun run dev`: Start the development server
- `bun run build`: Build the production-ready site
- `bun run preview`: Preview the built site
- `bun run typecheck`: Check TypeScript types with Astro
- `bun run lint`: Lint code with ESLint, Stylelint, and Markdownlint
- `bun run lint:fix`: Auto-fix linting issues where possible
- `bun run format`: Format code with Prettier
- `bun run format:check`: Check code formatting without modifying files
- `bun run test`: Test code with Vitest and Playwright
- `bun run check`: Run type checking, format checking, and linting
- `bun run verify`: Run all checks and tests (typecheck, lint, format, test)
- `bun run build-previews`: Build preview images for blog posts
- `bun run build-screenshots`: Build screenshots for the website
- `bun run html-validate`: Validate HTML using W3C validator
- `bun run prepare`: Set up git hooks with Husky

## Contributing

If you find a bug or have a feature request, please [open an issue](https://github.com/ruslanpashkov/ruslanpashkov.com/issues). If you want to contribute, please [fork the repository](https://github.com/ruslanpashkov/ruslanpashkov.com/fork) and make changes as you'd like. Pull requests are warmly welcome.

## License

This project is licensed under the following licenses:

- **Source Code**: [MIT License](LICENSE)
- **Website Content**: [CC BY-NC-SA 4.0](CC.md)
- **Fira Code & Montserrat Fonts**: [SIL Open Font License](OFL.md)

You can use, modify and share the source code with the license. Website content is for non-commercial use with credit, and changes must follow the same terms. The project's design, layout, and visual elements may not be copied or reused. Fonts are free to use but can't be sold by themselves.
