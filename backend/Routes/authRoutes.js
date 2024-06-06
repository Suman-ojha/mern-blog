const router = require('express').Router();

const authContoller = require('../Controllers/authController')

router.post('/register' , authContoller.register)
router.post('/signin' , authContoller.signin)
router.post('/google' , authContoller.googleAuth)

module.exports = router;