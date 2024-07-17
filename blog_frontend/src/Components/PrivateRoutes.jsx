import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/isTokenExpired'
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect } from 'react';

const PrivateRoutes = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    // console.log(!isTokenExpired(currentUser.token),"<<data");
    useEffect(() => {
        if (currentUser && isTokenExpired(currentUser.token)) {
            localStorage.removeItem('persist:root');
            dispatch(signoutSuccess())
        }
    }, [currentUser, dispatch]);

    return currentUser ? <Outlet /> : <Navigate to='/signin' />;
}

export default PrivateRoutes