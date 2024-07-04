const router = require('express').Router();
const postController = require('../Controllers/postController')

const authMiddleware = require('../Middlewares/auth_middleware')

router.post('/create' , authMiddleware.checkAuth ,postController.create_post)
router.post('/get-posts', postController.get_posts)
router.post('/delete' , authMiddleware.checkAuth ,postController.delete_post)
router.post('/update' , authMiddleware.checkAuth ,postController.update_post)

module.exports = router