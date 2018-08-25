const crypto = require('crypto');

const router = require('express').Router();
const db = require('../models').getDB();

router.post('/', async (req, res) => {
  const hashedPass = crypto.createHmac('sha256', req.body.password).digest('hex');
  const unAuth = await db.sequelize.models.User.authorize(req.body.username, hashedPass);
  if (unAuth) {
    const token = crypto.randomBytes(20).toString('hex');
    const newSession = await db.sequelize.models.Session.create({ token,
        UserId: unAuth.dataValues.id});
    res.cookie('token', token);
    const tokenized = await unAuth.update({ token });
    res.send(tokenized);
    return;
  }
  res.status(401).send('No such log + pas combination');
});

module.exports = router;
