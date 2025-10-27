export default {
  register(app) {
    app.addMenuLink({
      to: '/plugins/form-builder',
      icon: 'Plugin',
      intlLabel: {
        id: 'form-builder.label',
        defaultMessage: 'Form Builder',
      },
      Component: async () => import('./pages/App'),
    });
  },
};
