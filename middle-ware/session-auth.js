const User = require('../role-system/User');

const db = require('../models').getDB();

module.exports = async function checkKey(req, res, next) {
  if (req.url === '/authorization' || req.url === '/registration') {
    next();
    return;
  }
  const visiter = await db.sequelize.models.User.findOne({
    'where': {
      'token': req.cookies.token,
    },
  });
  if (visiter) {
    // eslint-disable-next-line max-len
    req.user = new User(visiter.dataValues.id, visiter.dataValues.username, visiter.dataValues.token, visiter.dataValues.role);
    next();
    return;
  }
  res.status(401).send();
};
