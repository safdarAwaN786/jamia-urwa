export default {
  async find(ctx) {
    const forms = await strapi.db.query('plugin::form-builder.form').findMany({
      populate: ['fields'],
    });
    ctx.body = forms;
  },

  async submit(ctx) {
    const { slug } = ctx.params;
    const data = ctx.request.body;

    const form = await strapi.db.query('plugin::form-builder.form').findOne({
      where: { slug },
    });
    if (!form) return ctx.notFound('Form not found');

    const submission = await strapi.db.query('plugin::form-builder.submission').create({
      data: {
        form: form.id,
        data,
      },
    });

    ctx.body = submission;
  },
};
