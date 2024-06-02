const router = require('express').Router();

const userController = require('../Controllers/userControllers');
const authMiddleware = require('../Middlewares/auth_middleware')

router.post('/get-user' ,authMiddleware.checkAuth  , userController.get_user_details)



module.exports = router