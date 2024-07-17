import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/isTokenExpired'
import { signoutSuccess } from '../redux/user/userSlice'
import { useEffect } from 'react';
const OnlyAdminPrivateRoutes = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        if (currentUser && isTokenExpired(currentUser.token)) {
            localStorage.removeItem('persist:root');
            dispatch(signoutSuccess())
        }
    }, [currentUser, dispatch]);
    return currentUser && currentUser.user_data.isAdmin ? <Outlet /> : <Navigate to='/signin' />;

}

export default OnlyAdminPrivateRoutes