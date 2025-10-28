import fs from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Utility: Load a JSON file relative to this file
 */
const loadJson = (relativePath) => {
    const absolutePath = join(__dirname, relativePath);
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
};

/**
 * Ensure directory exists
 */
const ensureDir = (dirPath) => {
    fs.mkdirSync(dirPath, { recursive: true });
};

/**
 * Create full API structure for a content type
 * Includes: schema.json, controller, service, router
 */
const createFullContentType = (schema, name) => {
    const apiBase = join(strapi.dirs.app.src, "api", name);
    const contentTypeDir = join(apiBase, "content-types", name);
    const controllerDir = join(apiBase, "controllers");
    const serviceDir = join(apiBase, "services");
    const routeDir = join(apiBase, "routes");

    const projectRoot = process.cwd();
    const isTypeScript = fs.existsSync(join(projectRoot, "tsconfig.json"));
    const ext = isTypeScript ? "ts" : "js";

    [contentTypeDir, controllerDir, serviceDir, routeDir].forEach(ensureDir);

    // Write schema
    fs.writeFileSync(join(contentTypeDir, "schema.json"), JSON.stringify(schema, null, 2));

    // Template code
    const controllerCode = `
    import { factories } from '@strapi/strapi';
    
    export default factories.createCoreController('api::${name}.${name}' as any);
    `.trim();

    const serviceCode = `
    import { factories } from '@strapi/strapi';

    export default factories.createCoreService('api::${name}.${name}' as any);
    `.trim();

    const routeCode = `
    import { factories } from '@strapi/strapi';

    export default factories.createCoreRouter('api::${name}.${name}' as any);
    `.trim();

    fs.writeFileSync(join(controllerDir, `${name}.${ext}`), controllerCode + "\n");
    fs.writeFileSync(join(serviceDir, `${name}.${ext}`), serviceCode + "\n");
    fs.writeFileSync(join(routeDir, `${name}.${ext}`), routeCode + "\n");

    strapi.log.info(`✅ Created API for "${name}" in src/api/${name}`);
};

/**
 * Check if a content type already exists
 */
const contentTypeExists = (uid) => !!strapi.contentTypes?.[uid];

export default {
    register({ strapi }) {
        strapi.log.info("🧩 Form Builder plugin registered.");
    },

    async bootstrap({ strapi }) {
        strapi.log.info("⚙️ Bootstrapping Form Builder...");

        // Marker file to avoid re-running creation logic repeatedly
        const markerPath = join(strapi.dirs.app.root, ".form-builder-installed");
        if (fs.existsSync(markerPath)) {
            strapi.log.info("🟢 Form Builder content types already set up. Skipping initialization.");
            return;
        }

        // Define your content type schemas
        const schemas = [
            { uid: "api::form.form", name: "form", schema: loadJson("./content-types/form/schema.json") },
            { uid: "api::form-field.form-field", name: "form-field", schema: loadJson("./content-types/form-field/schema.json") },
            { uid: "api::form-submission.form-submission", name: "form-submission", schema: loadJson("./content-types/form-submission/schema.json") },
        ];

        let created = false;

        for (const { uid, name, schema } of schemas) {
            if (contentTypeExists(uid)) {
                strapi.log.info(`🔹 ${name} already exists, skipping.`);
                continue;
            }

            createFullContentType(schema, name);
            created = true;
        }


        if (created) {
            // Create marker to skip next runs
            fs.writeFileSync(markerPath, Date.now().toString());

            strapi.log.info("🕒 New content types created. **Auto-restarting Strapi in 3 seconds...**");

            // Use a longer delay to ensure the port is released
            setTimeout(() => {
                try {
                    strapi.log.info("♻️ Attempting clean restart...");

                    // 1. Spawn the new process
                    const child = spawn("npm", ["run", "develop"], {
                        stdio: "inherit",
                        shell: true,
                        detached: true,
                    });

                    // 2. Detach and unref the child process
                    child.unref();

                    // 3. Immediately kill the current process to free the port/esbuild workers
                    // Use SIGINT (like Ctrl+C) for a cleaner shutdown than a hard exit
                    process.kill(process.pid, 'SIGINT');

                } catch (err) {
                    strapi.log.error("❌ Failed to restart Strapi automatically. Please restart manually:", err.message);
                }
            }, 3000); // <-- Increased delay to 3 seconds
        } else {
            strapi.log.info("✅ All form builder content types already exist.");
        }

        // if (created) {
        //     // Create marker to skip next runs
        //     fs.writeFileSync(markerPath, Date.now().toString());

        //     strapi.log.info("🕒 New content types created. Restarting Strapi in 1.5s...");

        //     setTimeout(() => {
        //         try {
        //             strapi.log.info("♻️ Restarting Strapi to register new content types...");

        //             const child = spawn("npm", ["run", "develop"], {
        //                 stdio: "inherit",
        //                 shell: true,
        //                 detached: true,
        //             });

        //             child.unref();
        //             process.exit(0);
        //         } catch (err) {
        //             strapi.log.error("❌ Failed to restart Strapi automatically:", err.message);
        //         }
        //     }, 1500);
        // } else {
        //     strapi.log.info("✅ All form builder content types already exist.");
        // }
    },
};
