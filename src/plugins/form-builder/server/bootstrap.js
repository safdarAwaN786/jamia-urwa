export default async ({ strapi }) => {
  const types = ['form', 'form-field', 'form-submission'];

  types.forEach((name) => {
    const uid = `plugin::form-builder.${name}`;
    const ct = strapi.contentTypes[uid];

    if (ct) {
      ct.config = {
        ...ct.config,
        pluginOptions: {
          ...ct.config.pluginOptions,
          'content-manager': { visible: true },
        },
      };
    }
  });
};
