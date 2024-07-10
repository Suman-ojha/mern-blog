import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../Components/PostCard';

const Search = () => {
  const [searchKey, setSearchKey] = useState('')
  const [order, setOrder] = useState('')
  const [category, setCategory] = useState('')
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    if (searchTermFromUrl) {
      setSearchKey(searchTermFromUrl)
    }
    if (sortFromUrl) {
      setOrder(sortFromUrl)
    }
    if (categoryFromUrl) {
      setCategory(categoryFromUrl)
    }
    // if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
    //   setSidebarData({
    //     ...sidebarData,
    //     searchTerm: searchTermFromUrl,
    //     sort: sortFromUrl,
    //     category: categoryFromUrl,
    //   })
    // }
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // const searchTermFromUrl = urlParams.get('searchTerm');
        // const searchQuery = urlParams.toString();
        const res = await fetch('/api/post/get-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //   'x-access-token': currentUser.token // Include the token here
          },
          body: JSON.stringify({ searchKey, order, category })
        })
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length >= 9) {
            setShowMore(true);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, [location.search])
  // console.log(sidebarData, "sidebardata");
  // console.log(posts, "post");
  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      // setSidebarData({ ...sidebarData, searchTerm: e.target.value });
      setSearchKey(e.target.value)
    }
    if (e.target.id === 'sort') {
      const orderValue = e.target.value || 'desc';
      // setSidebarData({ ...sidebarData, order: order });
      setCategory(orderValue)
    }
    if (e.target.id === 'category') {
      const categoryValue = e.target.value || 'uncategorized';
      // setSidebarData({ ...sidebarData, category });
      setCategory(categoryValue)
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchKey);
    urlParams.set('sort', order);
    urlParams.set('category', category);
    const searchQuery = urlParams.toString();
    // console.log(searchQuery)
    navigate(`/search?${searchQuery}`);
  }
  const handelShowMorePost = async () => {
    setLoading(true);
    const noOfPosts = posts.length;
    const startIndex = noOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch('/api/post/get-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //   'x-access-token': currentUser.token // Include the token here
        },
        body: JSON.stringify({ searchKey, order, category, startIndex })
      })
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setPosts([...posts, ...data.posts]);
        setLoading(false);
        if (data.posts.length >= 9) {
          setShowMore(true);
        }
      }
    } catch (e) {
      console.log(e.message)
    }


  }
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={searchKey}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={order} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={category}
              id='category'
            >
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='python'>Python</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handelShowMorePost}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search