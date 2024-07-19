import React from 'react'
import { Link } from 'react-router-dom'
import { MdCancel } from "react-icons/md"

const PaymentError = () => {
  return (
    <div className='min-h-screen max-w-sm mx-auto m-10'>
      <div className="bg-slate-100 shadow-2xl dark:bg-gray-700 p-6  md:mx-auto rounded-lg">
        <MdCancel className="text-red-600 w-16 h-16 mx-auto my-6" />
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 dark:text-white font-semibold text-center">
            Payment Failed!
            <span >😥</span>
          </h3>
          <p className="text-gray-600 my-2 dark:text-white">We are sorry! something went wrong. payment failed due to server issue.</p>
          <p> Please try again after some time.If error comes contact to admin. </p>
          <div className="py-10 text-center">
            <Link to={'/'} className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg">
              GO BACK
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentError