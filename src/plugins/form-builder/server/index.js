import fs from 'fs';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadJson = (relativePath) => {
  const absolutePath = join(__dirname, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
};

const contentTypeExists = (uid) => !!strapi.contentTypes?.[uid];

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

/**
 * Create full API structure for a content type in src/api/
 * Includes: schema.json, controller.js, service.js, router.js
 */
const createFullContentType = (schema, name) => {
  const apiBase = join(strapi.dirs.app.src, 'api', name);
  const contentTypeDir = join(apiBase, 'content-types', name);
  const controllerDir = join(apiBase, 'controllers');
  const serviceDir = join(apiBase, 'services');
  const routeDir = join(apiBase, 'routes');

  // Determine project language using process.cwd()
  const projectRoot = process.cwd();
  const isTypeScriptProject = fs.existsSync(join(projectRoot, 'tsconfig.json'));
  const ext = isTypeScriptProject ? 'ts' : 'js';

  // Ensure directories
  [contentTypeDir, controllerDir, serviceDir, routeDir].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

  // Write schema
  const schemaPath = join(contentTypeDir, 'schema.json');
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

  // Write files with proper extension
  fs.writeFileSync(join(controllerDir, `${name}.${ext}`), `
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::${name}.${name}');
`.trim() + '\n');

  fs.writeFileSync(join(serviceDir, `${name}.${ext}`), `
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::${name}.${name}');
`.trim() + '\n');

  fs.writeFileSync(join(routeDir, `${name}.${ext}`), `
import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::${name}.${name}');
`.trim() + '\n');

  strapi.log.info(` Created API for "${name}" in src/api/${name} (${ext})`);
};



const rebuildAndRestart = () => {
  try {
    strapi.log.info(' Rebuilding admin panel...');
    execSync('npm run build', { stdio: 'inherit' });
    strapi.log.info(' Build complete. Restarting Strapi...');
    const proc = spawn('npm', ['run', 'develop'], { stdio: 'inherit' });
    process.exit(0);
  } catch (err) {
    console.error(' Failed to rebuild/restart:', err.message);
  }
};

export default {
  register({ strapi }) {
    strapi.log.info(' Form Builder plugin registered.');
  },

  async bootstrap({ strapi }) {
    strapi.log.info(' Bootstrapping Form Builder...');

    // Load schemas from your plugin content-types folder
    const formSchema = loadJson('./content-types/form/schema.json');
    const fieldSchema = loadJson('./content-types/form-field/schema.json');
    const submissionSchema = loadJson('./content-types/form-submission/schema.json');

    const schemas = [
      { uid: 'api::form.form', name: 'form', schema: formSchema },
      { uid: 'api::form-field.form-field', name: 'form-field', schema: fieldSchema },
      { uid: 'api::form-submission.form-submission', name: 'form-submission', schema: submissionSchema },
    ];

    let created = false;

    for (const { uid, name, schema } of schemas) {
      if (contentTypeExists(uid)) {
        strapi.log.info(` ${name} already exists, skipping.`);
        continue;
      }

      createFullContentType(schema, name);
      created = true;
    }

    if (created) {
      rebuildAndRestart();
    } else {
      strapi.log.info(' All content types already exist.');
    }
  },
};
