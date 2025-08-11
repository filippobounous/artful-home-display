# Codex Instructions

## Development Steps

1. Install dependencies with `npm install`.
2. Before running, copy `.env.example` to `.env` and set `VITE_API_URL` (and optionally `VITE_API_KEY`).
3. Use `npm run dev` to check the application locally at http://localhost:5173.
4. Run `npm run lint` and `npm run build` before committing.
5. Use `npm run preview` to sanity-check the production build.
6. Keep the code in TypeScript (no plain JavaScript files).

## Code Style

- Use 2-space indentation and single quotes.
- After editing, run `npx eslint . --fix`.
- Format code with `npx prettier -w .` if available.
- Avoid introducing `any` types; prefer explicit typing.

## Commit Messages

- Use the format `<scope>: <subject>`.
- Limit the subject to 50 characters.
- Include a short body describing why the change is needed.
- Reference related issues when applicable.

## Pull Request Summary

- Briefly describe the change and mention any commands run (e.g. lint, build).
- Provide any manual testing steps used.
- Include a screenshot in the PR description if UI changes were made.
- Mention any changes to `.env` or other configuration files.

## Testing

- Add unit tests for new logic where possible.
- Ensure `npm run lint` and `npm run build` succeed.
- Manually verify critical user paths in the browser.
