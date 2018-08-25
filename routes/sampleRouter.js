const router = require('express').Router();

router.post('/', (req, res) => {
  res.send('This is sample static router');
});

module.exports = router;
