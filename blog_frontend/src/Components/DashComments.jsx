import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';


const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  // const { currentUser } = useSelector((state) => state.user);
  //   const [users, setUsers] = useState([]);
  //   const [showMore, setShowMore] = useState(true);
  //   const [showModal, setShowModal] = useState(false);
  //   const [userIdToDelete, setUserIdToDelete] = useState('');
  useEffect(() => {
    let isMounted = true;
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': currentUser.token,
          },
          // body: JSON.stringify({

          //     post_id: postId,
          //     // userId: currentUser.user_data._id,
          // }),
        });
        if (res.ok) {
          const data = await res.json();
          // console.log((data.data ,'jk'));
          setComments(data?.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.user_data.isAdmin) {
      fetchComments();
    }
    return () => {
      isMounted = false;
    };

  }, [currentUser.user_data._id]);

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch('/api/comment/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.token // Include the token here
        },
        body: JSON.stringify({ comment_id: commentIdToDelete })
      })
      const data = await res.json();
      // console.log(data , "<<<data")
      if (res.ok) {
        toast.success(data.message);
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        )
        setShowModal(false);
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleShowMore = async () => {
    // console.log('here');
    const startIndex = comments.length;
    try {
      const res = await fetch('/api/user/get-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.token // Include the token here
        },
        body: JSON.stringify({ startIndex }),
      });
      if (res.ok) {
        const data = await res.json();
        // console.log((data.data ,'jk'));
        setComments((prev)=>[...prev , ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  // console.log(users ,"<<userdata")
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.user_data.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head className='text-center'>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes </Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment, idx) => (
              <Table.Body key={idx} className='divide-y text-center'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>

                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) :
        (
          <p>You have no comments yet!</p>
        )
      }
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteComment}>
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

export default DashComments;