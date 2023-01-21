const exp =  require('express');
const router = exp.Router();

const { registerUser, loginUser, logout, getUser } = require("../controllers/userController");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/getuser', getUser);

module.exports = router;