const router = require('express').Router();


const commonController = require('../Controllers/commonController')

router.post("/forget-password", commonController.forgetPassword);
router.post("/reset-password/:token", commonController.resetPassword);


module.exports = router;