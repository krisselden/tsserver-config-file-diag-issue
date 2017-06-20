# Reproduction of tsserver ConfigFileDiagnosticEvent issue

```sh
yarn
node test.js
```

Adding `tmp/index.ts` triggers `configFileDiag` event to fire even though this file has nothing to do with the `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "es2015",
    "moduleResolution": "node",
    "target": "es2015",
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": [ "src/**/*.ts" ]
}
```

This in combination with a recent change to VS Code's handling of this event in 1.13.x causes a severe performance regression (tmp is used by our build pipeline) by opening the triggerFile creating an implicit project and diagnostics to be displayed for unrelated files.
