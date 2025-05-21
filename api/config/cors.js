const cors = require('cors');

const configureCors = (app) => {
  app.use(cors());
};

module.exports = configureCors;
