export default [
  {
    method: 'GET',
    path: '/forms',
    handler: 'form.find',
    config: { auth: false },
  },
  {
    method: 'POST',
    path: '/forms/:slug/submit',
    handler: 'form.submit',
    config: { auth: false },
  },
];
