const router = require('express').Router();
const postController = require('../Controllers/postController')

const authMiddleware = require('../Middlewares/auth_middleware')

router.post('/create' , authMiddleware.checkAuth ,postController.create_post)

module.exports = router