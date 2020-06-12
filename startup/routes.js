const OAuth = require('../routes/oauth');
const basic = require('../routes/basic');
const cors = require('cors');

module.exports = app => {
  app.use(cors());
  app.use('/auth', OAuth);
  app.use('/', basic);
}
