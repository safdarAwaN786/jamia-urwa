import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// --- File Path Setup (Standard for ESM in Strapi) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to load JSON files
const loadJson = (relativePath) => {
  const absolutePath = join(__dirname, relativePath);
  try {
    const fileContent = readFileSync(absolutePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Form Builder: Failed to load content type schema at ${relativePath}`, error.message);
    return {}; // Return empty object on failure
  }
};

// --- Main Plugin Server Logic ---
export default {
  /**
   * Register must be synchronous and only define content types, services, etc.
   * Do not run database queries here.
   */
  register({ strapi }) {
    console.log('✅ Form Builder plugin registered (Synchronous)');
    
    // Load schemas
    const formSchema = loadJson('./content-types/form/schema.json');
    const formFieldSchema = loadJson('./content-types/form-field/schema.json');
    const formSubmissionSchema = loadJson('./content-types/form-submission/schema.json');

    // CRITICAL FIX: Register content types directly to strapi.contentTypes
    strapi.contentTypes['plugin::form-builder.form'] = formSchema;
    strapi.contentTypes['plugin::form-builder.form-field'] = formFieldSchema;
    strapi.contentTypes['plugin::form-builder.form-submission'] = formSubmissionSchema;

    console.log('Content types registered successfully.');
  },


  /**
   * Bootstrap runs after all plugins and services are registered.
   * This is the correct place for database checks, permission setup, and seeding.
   */
  async bootstrap({ strapi }) {
    console.log('🚀 Form Builder plugin bootstrapping (Asynchronous)');
    
    try {
      // 1. Fetch the necessary roles first
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      // 2. NEW CHECK: Check if a unique permission has already been set (more reliable than querying custom model)
      const isInstalled = await strapi.db.query('plugin::users-permissions.permission').count({
        where: {
          action: 'plugin::form-builder.form-submission.create',
          role: publicRole.id,
        },
      });

      if (isInstalled > 0) {
        console.log('Form Builder is already installed (permissions exist). Skipping permission setup.');
        return;
      }
      
      console.log('Setting up default permissions...');
      
      const permissionService = strapi.plugin('users-permissions').service('permissions');
      
      // Define permissions structure (using your original, good logic)
      const permissionsToCreate = [
        // Public permissions (read forms, create submissions)
        { role: publicRole.id, actions: [
          'plugin::form-builder.form.find',
          'plugin::form-builder.form.findOne',
          'plugin::form-builder.form-submission.create',
        ]},
        // Authenticated permissions (full access to Form content types)
        { role: authenticatedRole.id, actions: [
          'plugin::form-builder.form.find', 'plugin::form-builder.form.findOne', 'plugin::form-builder.form.create', 'plugin::form-builder.form.update', 'plugin::form-builder.form.delete',
          'plugin::form-builder.form-field.find', 'plugin::form-builder.form-field.findOne', 'plugin::form-builder.form-field.create', 'plugin::form-builder.form-field.update', 'plugin::form-builder.form-field.delete',
          'plugin::form-builder.form-submission.find', 'plugin::form-builder.form-submission.findOne', 'plugin::form-builder.form-submission.create', 'plugin::form-builder.form-submission.update', 'plugin::form-builder.form-submission.delete',
        ]},
      ];

      for (const { role, actions } of permissionsToCreate) {
        await permissionService.createPermissions({
          role: role,
          permissions: actions.map(action => ({ action }))
        });
      }
      
      console.log('Form Builder installation and permission setup completed.');
    } catch (error) {
      // Important: Log any errors, especially in bootstrap/register
      // This will now catch other errors, but should resolve the "Model not found" issue.
      console.error('⚠️  Error during Form Builder plugin bootstrap/installation:', error.message);
    }
  }
};
