# v2 SDK source

The embeddable chatbot SDK served at `/v2/sdk.js` is **generated** from this directory.

## Edit workflow

1. Change source files under `src/v2/sdk/`.
2. Run `npm run build:sdk` (or `npm run build:sdk:watch` during local LP testing).
3. Output is written to `public/v2/sdk.js`. esbuild `target` is `es2015` so ES2020 syntax in this folder is downleveled for older WebViews.

Do **not** hand-edit `public/v2/sdk.js`; it will be overwritten on the next build.

## Custom JS

`integrations/customJs.js` injects operator-configured JavaScript onto the merchant page. That is an explicit privileged setting (trusted operator input), not visitor-supplied HTML.

## Layout utilities

Iframe sizing helpers are shared with the admin preview via `src/v2/utils/sdkLayoutUtils.js`.
