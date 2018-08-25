const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('This is sample static router');
});

module.exports = router;
