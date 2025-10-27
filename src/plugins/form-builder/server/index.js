import routes from './routes/index.js';
import formController from './controllers/form.js';

export default ({ strapi }) => ({
  register() {
    strapi.log.info('📦 Registering Form Builder Plugin');

    strapi.plugin('form-builder').controllers = {
      form: formController,
    };

    strapi.plugin('form-builder').routes = routes;
  },

  bootstrap() {
    strapi.log.info('🚀 Form Builder Plugin Ready');
  },
});
