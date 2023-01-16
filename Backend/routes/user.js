const exp =  require('express');
const router = exp.Router();

const { user } = require("../controllers/user");

router.post('/register', user);

module.exports = router;