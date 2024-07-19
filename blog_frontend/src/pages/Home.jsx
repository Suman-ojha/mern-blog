import { Link } from 'react-router-dom';
import CallToAction from '../Components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../Components/PostCard';
import SubscriptionCards from '../Components/SubscriptionCards';

const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/get-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //   'x-access-token': currentUser.token // Include the token here
          },
          // body: JSON.stringify({ limit: 5 }
        })
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
    return () => {
      isMounted = false;
    }
  }, [])
  // console.log(posts, "<<post");
  const subscribe_data = [
    {
      id: 1,
      title: "Normal Plan",
      price: 199,
      currency: 'INR',
      role: [
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "RollBase access"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "Unlimited file action"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "Admin dashboard access"
        },
      ]
    },
    {
      id: 2,
      title: "Gold Plan",
      price: 299,
      currency: 'INR',
      role: [
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
      ]
    },
    {
      id: 3,
      title: "Pro Plan",
      price: 499,
      currency: 'INR',
      role: [
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
        {
          role_slug_name: "ai_chat",
          role_name: "AI Blog writter"
        },
      ]
    },
  ]
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome To My Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className="flex flex-col  items-center mb-5">
        <h1 className='text-xl mt-5 font-semibold'>Subscription</h1>
        <div className="m-4 flex flex-wrap gap-5 justify-around md:flex-nowrap">
          {
            subscribe_data && subscribe_data.map((item, idx) => <SubscriptionCards key={idx} data={item} />)
          }
        </div>
      </div>
      <div className='flex flex-col  items-center mb-5'>
        <h1 className='text-xl mt-5 font-semibold'>Recent Posts</h1>
        <div className='flex flex-wrap gap-5 m-4 justify-center'>
          {posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        <Link
          to={'/search'}
          className='text-lg text-teal-500 hover:underline text-center'
        >
          View all posts
        </Link>
      </div>

    </div>
  )
}

export default Home