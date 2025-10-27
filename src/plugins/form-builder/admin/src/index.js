// import { prefixPluginTranslations } from '@strapi/helper-plugin';

// export default {
//   register(app) {
//     app.addMenuLink({
//       to: '/plugins/form-builder',
//       icon: 'Plugin', // Use a valid Strapi icon or import a custom one
//       intlLabel: {
//         id: 'form-builder.label',
//         defaultMessage: 'Form Builder',
//       },
//       Component: async () => import('./pages/App'),
//     });

//     app.registerPlugin({
//       id: 'form-builder',
//       name: 'Form Builder',
//     });
//   },

//   bootstrap(app) {
//     // Optional: Add bootstrap logic if needed
//   },

//   async registerTrads({ locales }) {
//     const importedTrads = await Promise.all(
//       locales.map((locale) =>
//         import(`./translations/${locale}.json`)
//           .then(({ default: data }) => ({ data: prefixPluginTranslations(data, 'form-builder'), locale }))
//           .catch(() => ({ data: {}, locale }))
//       )
//     );
//     return Promise.resolve(importedTrads);
//   },
// };

import pluginId from './pluginId';

const adminPlugin = {
  register(app) {
    // Add your admin components here
  },

  bootstrap(app) {
    // Bootstrap logic for admin
  },

  async registerTrads({ locales }) {
    // Load translations if needed
    return [];
  }
};

export default adminPlugin;