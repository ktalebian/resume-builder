import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "resume-api",
      configureServer(server) {
        server.middlewares.use("/api/save-resume", (req, res, next) => {
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                // Validate JSON
                JSON.parse(body);
                // Write to resume.json file
                fs.writeFileSync(
                  path.join(__dirname, "content/resume.json"),
                  body,
                );
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
              }
            });
          } else {
            next();
          }
        });

        server.middlewares.use("/api/load-resume", (req, res, next) => {
          if (req.method === "GET") {
            try {
              const resumeData = fs.readFileSync(
                path.join(__dirname, "content/resume.json"),
                "utf8",
              );
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(resumeData);
            } catch (error) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Resume file not found" }));
            }
          } else {
            next();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
