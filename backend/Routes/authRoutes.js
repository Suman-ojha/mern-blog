const router = require('express').Router();

const authContoller = require('../Controllers/authController')

router.post('/register' , authContoller.register)
router.post('/signin' , authContoller.signin)

module.exports = router;