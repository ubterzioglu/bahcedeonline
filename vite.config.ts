import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    // tanstackStart() includes the TanStack Router plugin, which MUST run
    // before any JSX-transform plugin (viteReact). Order is enforced.
    tanstackStart(),
    viteReact(),
  ],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
  },
});
