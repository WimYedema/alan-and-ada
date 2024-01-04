# Alan & Ada kids programming

Play the [game](https://wimyedema.github.io/alan-and-ada/) and
start [editing](https://vscode.dev/github/WimYedema/alan-and-ada)!

## Running locally

- Using [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
- Run the `npm install` to install dependencies
- Run the `npm run dev` to run the development server to test out changes
  - [Webpack](https://webpack.js.org/) will build the [typescript](https://www.typescriptlang.org/) into javascript
  - [Webpack dev server](https://webpack.js.org/configuration/dev-server/) will host the script in a little server on http://localhost:9000/

## Building bundles

- Run `npm run build:dev` to produce javascript bundles for debugging in the `dist/` folder
- Run `npm run build:prod` to produce javascript bundles for production (minified) in the `dist/` folder

## Run-time developer aids

The following key combo's can be used to help development:

| Key combo  | Description                                        |
| ---------- | -------------------------------------------------- |
| **Escape** | Enter debug-mode: visualize bounding boxes and ids |
| **N**      | Only in debug-mode: finish the current level       |

# Credits

- Code is based on the sample platform game of [ExcaliburJS](https://excaliburjs.com)
- Tiles from: [Platform Asset Pack By Cam Tatz (@CamTatz)](https://opengameart.org/content/platformer-asset-pack-1)
- Alan and Ada from: [Game Art 2D](https://www.gameart2d.com/freebies.html)
