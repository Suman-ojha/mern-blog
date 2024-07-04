import React from 'react'
import { Sidebar } from 'flowbite-react';
import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { signoutSuccess } from '../redux/user/userSlice';




const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('')
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }

    }, [location.search])

    const handleSignout = async () => {
        // console.log('signout')
        dispatch(signoutSuccess())
        // Clear the persisted state from localStorage
        localStorage.removeItem('persist:root');
        toast.success('You have successfully logged out.');
        navigate('/signin')
    }
    return (
        <Sidebar className='w-full'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} label={currentUser.user_data.isAdmin === false ? "User" : 'Admin'} icon={HiUser} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                   {currentUser.user_data.isAdmin &&  <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item active={tab === 'posts'}  icon={HiDocumentText}  as='div'>
                            Posts
                        </Sidebar.Item>
                    </Link>}
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar