import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostCard from '../Components/PostCard';


const PostPage = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/post/get-posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'x-access-token': currentUser.token // Include the token here
                    },
                    body: JSON.stringify({ slug: postSlug }),
                });
                const data = await res.json();
                // console.log(data.posts,'<data')
                if (data.status === 'error') {
                    setError(true);
                    setLoading(false);
                    toast.error(data.message);
                    return;
                }
                if (data.status === 'success') {
                    setPost(data.posts[0])
                    setLoading(false);
                    setError(false);
                }
            } catch (error) {
                toast.error(error.message)
                console.log(error)
            }

        }
        fetchPost();
        return () => {
            isMounted = false;
        }
    }, [postSlug])

    useEffect(() => {
        let isMounted = true;
        try {

            const fetchRecentPosts = async () => {
                const res = await fetch('/api/post/get-posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'x-access-token': currentUser.token // Include the token here
                    },
                    body: JSON.stringify({ limit: 3 }),
                });
                const data = await res.json();
                // console.log(data.posts,'<data')
                if (data.status === 'error') {
                    // console.log(data.message)
                    return;
                }
                if (data.status === 'success') {
                    setRecentPosts(data.posts);
                }
            }
            fetchRecentPosts();
        } catch (error) {
            console.log(error.message);
        }
        return () => {
            isMounted = false;
        }
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size='xl' />
            </div>
        )
    }
    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
                {post && post.title}
            </h1>
            <Link
                to={`/search?category=${post && post.category}`}
                className='self-center mt-5'
            >
                <Button color='gray' pill size='sm' >
                    {post && post.category}
                </Button>
            </Link>
            <img
                src={post && post.image}
                alt={post && post.title}
                className='mt-10 p-3 max-h-[600px] w-full object-cover'
            />
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>
                    {post && (post.content.length / 1000).toFixed(0)} {parseInt((post.content.length / 1000).toFixed(0)) === 0 ? "min" : "mins"} read
                </span>
            </div>
            <div
                className='p-3 max-w-2xl mx-auto w-full post-content'
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            ></div>
        </main>
    )
}

export default PostPage