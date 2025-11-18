import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.js",
    output: [
      { file: "dist/index.esm.js", format: "es" },
      { file: "dist/index.cjs.js", format: "cjs" }
    ],
    plugins: []
  },
  {
    input: "src/index.d.ts",
    output: { file: "dist/index.d.ts", format: "es" },
    plugins: [dts()]
  }
];
