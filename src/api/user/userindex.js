const UsersHandler = require('./userhandler');
const routes = require('./userrouter');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const usershandler = new UsersHandler(service, validator);
    server.route(routes(usershandler));
  },
};
