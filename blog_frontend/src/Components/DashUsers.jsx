import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';


const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    // const { currentUser } = useSelector((state) => state.user);
    //   const [users, setUsers] = useState([]);
    //   const [showMore, setShowMore] = useState(true);
    //   const [showModal, setShowModal] = useState(false);
    //   const [userIdToDelete, setUserIdToDelete] = useState('');
    useEffect(() => {
        let isMounted = true;
        const fetchPost = async () => {
            try {
                const res = await fetch('/api/user/get-users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': currentUser.token // Include the token here
                    },
                    // body: JSON.stringify({ userId: currentUser.user_data._id }),
                });
                const data = await res.json();
                // console.log(data.users,'<data')
                if (data.status === 'error') {
                    toast.error(data.message)
                }
                if (data.status === 'success') {
                    setUsers(data.users);
                    // console.log(users)
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                toast.error(error.message)
                console.log(error)
            }

        }
        if (currentUser.user_data.isAdmin) {
            // console.log('call');
            fetchPost()
        }
        return () => {
            isMounted = false;
        };

    }, [currentUser.user_data._id]);

    const handelDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch('/api/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': currentUser.token // Include the token here
                },
                body: JSON.stringify({ id: userIdToDelete }),
            });
            const data = await res.json();
            // console.log(data)
            if (data.status === 'error') {
                toast.error(data.message)
            }
            if (data.status === 'success') {
                toast.success(data.message)
                //we are not calling api...want to minimise the laoding time...we can call fetchPost also instead.
                setUsers((prev) => prev.filter((user) => user._id != userIdToDelete))
                //just filter(remove) the deleted post form the list
            }
        } catch (e) {
            toast.error(e.message)
        }
    }
    const handleShowMore = async () => {
        // console.log('here');
        const startIndex = users.length;
        try {
            const res = await fetch('/api/user/get-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': currentUser.token // Include the token here
                },
                body: JSON.stringify({  startIndex }),
            });
            const data = await res.json();
            if (data.status === 'error') {
                console.log(data.message)
            }
            if (data.status === 'success') {
                //added to main list
                setUsers((prev) => [...prev, ...data.users])
                if (data.users.length < 9) {
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
            {currentUser.user_data.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head className='text-center'>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user, idx) => (
                            <Table.Body key={idx} className='divide-y text-center'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilepic}
                                            alt={user.username}
                                            className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className='text-green-500' />
                                        ) : (
                                            <FaTimes className='text-red-500' />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
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
                    <p>You have no users yet!</p>
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
                            Are you sure you want to delete this post?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={handelDeletePost}>
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

export default DashUsers