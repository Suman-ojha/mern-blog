import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashProfile from "../Components/DashProfile";
import DashSidebar from "../Components/DashSidebar";
import DashPost from "../Components/DashPost";
import DashUsers from "../Components/DashUsers";
import DashComments from "../Components/DashComments";



const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }

  }, [location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === 'profile' && <DashProfile />}
      {/* posts */}
      {tab === 'posts' && <DashPost />}
      {/* users */}
      {tab === 'users' && <DashUsers />}
      {/* comments  */}
      {tab === 'comments' && <DashComments />}
    </div>
  )
}

export default Dashboard