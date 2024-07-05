const router = require('express').Router();

const commentController = require('../Controllers/commentController');
const auth_middleware = require('../Middlewares/auth_middleware');

router.post('/create' , auth_middleware.checkAuth  , commentController.create_comment)
router.post('/update' , auth_middleware.checkAuth  , commentController.edit_comment)
router.post('/delete' , auth_middleware.checkAuth  , commentController.delete_comment)

//like comment
router.post('/liked-comment' , auth_middleware.checkAuth  , commentController.liked_comment)
router.post('/get-post-comments' ,  commentController.fetch_post_comments)
router.post('/get-comments' , auth_middleware.checkAuth  , commentController.fetch_comments)



module.exports = router;