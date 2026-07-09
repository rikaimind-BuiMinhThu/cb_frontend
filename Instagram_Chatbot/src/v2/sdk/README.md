# v2 SDK source

The embeddable chatbot SDK served at `/v2/sdk.js` is **generated** from this directory.

## Edit workflow

1. Change source files under `src/v2/sdk/`.
2. Run `npm run build:sdk` (or `npm run build:sdk:watch` during local LP testing).
3. Output is written to `public/v2/sdk.js`.

Do **not** hand-edit `public/v2/sdk.js`; it will be overwritten on the next build.

## Layout utilities

Iframe sizing helpers are shared with the admin preview via `src/v2/utils/sdkLayoutUtils.js`.
