import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const OnlyAdminPrivateRoutes = () => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser && currentUser.user_data.isAdmin ? <Outlet /> : <Navigate to='/signin' />;
  
}

export default OnlyAdminPrivateRoutes