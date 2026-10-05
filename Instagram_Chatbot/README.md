# EC-Chatbot

## Language

Admin SPA source is **ES6**. Create React App transpiles newer syntax for the admin bundle.
The embeddable widget SDK is built separately with esbuild (`npm run build:sdk`) targeting **ES2015**, so optional chaining (`?.`) and nullish coalescing (`??`) in `src/v2/sdk` are downleveled.

## Scripts

- `npm start` — admin on port 3001
- `npm run build` — SDK + production admin build
- `npm run build:sdk` — regenerate `public/v2/sdk.js` from `src/v2/sdk`

Webpack 4 needs OpenSSL’s legacy provider on **Node 17+**. `scripts/react-scripts-with-openssl.js` sets `NODE_OPTIONS=--openssl-legacy-provider` only then, so Node 16 can run `npm start` without that flag.

## Auth (V2)

V2 admin lives under `/v2`. Unauthenticated users are sent to `/v2/sign-in`.
The shared axios client in `src/v2/api/api-management.js` reads the token cookie on every request.

