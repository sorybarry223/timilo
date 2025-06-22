import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  outDir: 'dist',
  noExternal: ['axios'], // ← bundle axios inside the final output
});
