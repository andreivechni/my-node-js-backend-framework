const crypto = require('crypto');

const router = require('express').Router();
const db = require('../models').getDB();

router.post('/', async (req, res) => {
  const hashedPass = crypto.createHmac('sha256', req.body.password).digest('hex');
  const newUser = await db.sequelize.models.User.register(req.body.username, hashedPass);
  if (newUser) {
    res.status(200).send(newUser);
    return;
  }
  res.status(409).send('This username has been already taken');
});

module.exports = router;
