import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import Comment from './Comment';


const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    // console.log(comment)
    const navigate = useNavigate();




    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!currentUser){
            navigate('/signin');
            return;
        }
        if (comment.length > 200 || comment.length===0) {
            return;
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': currentUser.token // Include the token here
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    // userId: currentUser.user_data._id,
                }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                toast.success(data.message);
                setComment('');
                setCommentError(null);
                setComments([ ...comments, data.comment]);
            }
        } catch (error) {
            setCommentError(error.message)
        }

    }
    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/get-post-comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({

                        post_id: postId,
                        // userId: currentUser.user_data._id,
                    }),
                });
                if (res.ok) {
                    const data = await res.json();
                    // console.log((data.data ,'jk'));
                    setComments(data?.data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getComments();
    }, [postId]);
    const handleDelete = async (comment_id) => {
        // console.log(comment_id, 'ds')
        setShowModal(false);
        try {
            const res = await fetch('/api/comment/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': currentUser.token // Include the token here
                },
                body: JSON.stringify({ comment_id})
            })
            const data = await res.json();
            // console.log(data , "<<<data")
            if(res.ok){
                toast.success(data.message);
                setComments(comments.filter((comment)=> comment._id!==comment_id))
                setShowModal(false);
            }
            if(data.status==='error'){
                toast.error(data.message)
            }
        } catch (e) {
            toast.error(data.message)
            console.log(e.message)
        }
    }
    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/signin');
                //if user is not signed in..not able to like that
            }
            const res = await fetch('/api/comment/liked-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': currentUser.token // Include the token here
                },
                body: JSON.stringify({ comment_id: commentId })
            })
            if (res.ok) {
                const data = await res.json();
                // console.log(data,"<<dasas")
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                likes: data.comment.likes,
                                numberOfLikes: data.comment.numberOfLikes,
                            }
                            : comment
                    )//only update the mathced comment 
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((item) =>
                item._id !== comment._id ? item : { ...item, content: editedContent }
                //edited the mathced comments 
            )
        )
    }
    // console.log(comments,"comm");
    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ?
                (
                    <div className="flex items-center gap-1 my-6 text-gray-500 text-sm">
                        <p>Signed In as: </p>
                        <img
                            src={currentUser.user_data.profilepic}
                            alt='profile_pic'
                            className='w-5 h-5 rounded-full object-cover'
                        />
                        <Link to={`/dashboard?tab=profile`} className='text-xs text-cyan-500 hover:underline'>
                            @{currentUser.user_data.username}
                        </Link>
                    </div>
                )
                :
                (
                    <div className='text-sm text-teal-500 my-5 flex gap-1'>
                        You must be signed in to comment.
                        <Link className='text-blue-500 hover:underline' to={'/signin'}>
                            Sign In
                        </Link>
                    </div>
                )}
            {currentUser && (
                <form
                    onSubmit={handleSubmit}
                    className='border border-teal-500 rounded-md p-3'
                >
                    <Textarea
                        placeholder='Add a comment...'
                        rows='3'
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className='text-xs text-gray-500'>{200 - comment.length} characters remaining..</p>
                        <Button gradientDuoTone='purpleToBlue' outline type='submit'>Submit</Button>
                    </div>
                    {commentError && (
                        <Alert color='failure' className='mt-5'>
                            {commentError}
                        </Alert>
                    )}
                </form>
            )}
            {comments.length === 0 ? (
                <p className='text-center text-gray-500 text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                    <div className="flex items-center text-sm gap-1 my-5">
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment ,idx) => (

                        <Comment
                            key={idx}
                            comment={comment}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={(commentId) => {
                                setShowModal(true);
                                setCommentToDelete(commentId);
                            }}
                        />
                    ))}
                </>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this post?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color='failure'
                                onClick={() => handleDelete(commentToDelete)}
                            >
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CommentSection