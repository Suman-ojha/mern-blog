import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className="page_404 py-10 bg-white">
    <div className="container mx-auto">
      <div className="flex justify-center items-center">
        <div className="text-center">
          <div className="four_zero_four_bg bg-center bg-no-repeat bg-cover h-96" >
          </div>
          <div className="contant_box_404 mt-10">
            <h3 className="text-5xl dark:text-gray-500">
              Look like you're lost
            </h3>
            <p className="text-xl my-4 dark:text-gray-500">The page you are looking for is not available!</p>
            <Link to={'/'} className="link_404 text-white py-2 px-4 bg-green-600 hover:bg-green-700 rounded">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default PageNotFound