import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const { currentUser } = useSelector(state => state.user)
  const [user, setUser] = useState({})
  const [isEdited, setIsEdited] = useState(false)
  const [editedContent, setEditedContent] = useState(comment?.content ?? '')
  // console.log(currentUser , "<<comesnt");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/get-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: currentUser.user_data._id }),
          signal: signal
        });
        if (res.ok) {
          const data = await res.json();
          // console.log(data , "<<S")
          setUser(data.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
    return () => controller.abort();
  }, [comment]);
  const handleEdit = () => {
    setIsEdited(true);
    setEditedContent(comment.content);
  };
  // console.log(user , "user  ")
  // console.log(comment.numberOfLikes, "like")
  // const currentUserObjectId = new mongoose.Types.ObjectId(currentUser.user_data._id);
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img src={user?.profilepic} alt={user.username} className='w-10 h-10 rounded-full bg-gray-300' />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user?.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <p className='text-gray-500 pb-2'>{comment.content}</p>
      <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
        <button
          type='button'
          onClick={() => onLike(comment._id)}
          className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.length >0 &&
            comment.likes.findIndex(like => like.userId.toString() === currentUser.user_data._id.toString()) !== -1 &&
            '!text-blue-500'
            }`}
        >
          <FaThumbsUp className='text-sm' />
        </button>
        {/* {currentUser && } */}
        <p className='text-gray-400 '>
          {comment.numberOfLikes > 0 &&
            comment.numberOfLikes +
            ' ' +
            (comment.numberOfLikes === 1 ? 'like' : 'likes')}
        </p>
        {currentUser &&
          (currentUser.user_data._id === comment.userId || currentUser.user_data.isAdmin) && (
            <>
              <button
                type='button'
                onClick={handleEdit}
                className='text-gray-400 hover:text-blue-500'
              >
                Edit
              </button>
              <button
                type='button'
                onClick={() => onDelete(comment._id)}
                className='text-gray-400 hover:text-red-500'
              >
                Delete
              </button>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Comment