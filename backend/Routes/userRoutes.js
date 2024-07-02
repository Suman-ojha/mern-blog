const router = require('express').Router();

const userController = require('../Controllers/userControllers');
const authMiddleware = require('../Middlewares/auth_middleware')

router.post('/get-user' , userController.get_User)
router.post('/get-users' ,authMiddleware.checkAuth  , userController.get_Users)
router.post('/update' ,authMiddleware.checkAuth  , userController.update_user_details)
router.post('/delete' ,authMiddleware.checkAuth  , userController.delete_user)



module.exports = router