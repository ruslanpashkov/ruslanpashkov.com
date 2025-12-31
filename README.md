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

- `bun astro`: Run Astro CLI commands directly
- `bun dev`: Start the development server
- `bun build`: Build the production-ready site
- `bun preview`: Preview the built site
- `bun typecheck`: Check TypeScript types with Astro
- `bun lint`: Lint code with ESLint, Stylelint, and Markdownlint
- `bun lint:fix`: Auto-fix linting issues where possible
- `bun format`: Format code with Prettier
- `bun format:check`: Check code formatting without modifying files
- `bun test`: Test code with Vitest and Playwright
- `bun test:vitest:coverage`: Run Vitest tests with coverage report
- `bun check`: Run type checking, format checking, and linting
- `bun verify`: Run all checks and tests (typecheck, lint, format, test)
- `bun build-previews`: Build preview images for blog posts
- `bun build-screenshots`: Build screenshots for the website
- `bun html-validate`: Validate HTML using W3C validator
- `bun prepare`: Set up git hooks with Husky

## Contributing

If you find a bug or have a feature request, please [open an issue](https://github.com/ruslanpashkov/ruslanpashkov.com/issues). If you want to contribute, please [fork the repository](https://github.com/ruslanpashkov/ruslanpashkov.com/fork) and make changes as you'd like. Pull requests are warmly welcome.

## License

This project is licensed under the following licenses:

- **Source Code**: [MIT License](LICENSE)
- **Website Content**: [CC BY-NC-SA 4.0](CC.md)
- **Fira Code & Montserrat Fonts**: [SIL Open Font License](OFL.md)

You can use, modify and share the source code with the license. Website content is for non-commercial use with credit, and changes must follow the same terms. The project's design, layout, and visual elements may not be copied or reused. Fonts are free to use but can't be sold by themselves.
