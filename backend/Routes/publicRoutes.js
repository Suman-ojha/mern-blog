const router = require('express').Router();


const commonController = require('../Controllers/commonController')

router.post("/forget-password", commonController.forgetPassword);
router.post("/reset-password", commonController.resetPassword);
router.post("/create-checkout-session", commonController.create_stripe_payment_checkout_session);



module.exports = router;