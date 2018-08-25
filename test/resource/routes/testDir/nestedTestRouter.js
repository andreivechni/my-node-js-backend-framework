const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('This is nested sample static router');
});

module.exports = router;
