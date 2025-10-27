import routes from './routes/index.js';
import formController from './controllers/form.js';
import contentTypes from './content-types/index.js';

export default {
  register({ strapi }) {
    strapi.log.info('📦 Registering Form Builder Plugin');

    strapi.plugin('form-builder').controllers = {
      form: formController,
    };

    strapi.plugin('form-builder').routes = routes;
  },

  bootstrap({ strapi }) {
    strapi.log.info('🚀 Form Builder Plugin Ready');
  },

  contentTypes,
};
