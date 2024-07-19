import { Button } from 'flowbite-react';
import React from 'react'
import { HiArrowRightCircle } from "react-icons/hi2";
import {loadStripe} from '@stripe/stripe-js';

const SubscriptionCards = ({ data }) => {
    const handleStripePayment = async() =>{
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

        const res = await fetch('/api/create-checkout-session',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({product : data})
        })
        // console.log('checkout stripe...')
        const session = await res.json(); //new session will be created..
        const result = await stripe.redirectToCheckout({
            sessionId:session.id
        })
        if(result.error){
            console.log(result.error ,"erro");
        }


    }
    return (
        <>
            <div className='w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 '>
                <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{data.title}</h5>
                <div className=" items-baseline text-gray-900 dark:text-white">
                    <span className="text-3xl font-semibold">₹</span>
                    <span className="text-3xl font-extrabold tracking-tight">{data.price}</span>
                    <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
                </div>
                {/* role_slug_name: "ai_chat",
          role_name: "AI Blog writter" */}
                <ul role="list" className="space-y-5 my-7">
                    {data && data.role && (
                        data.role.map((item, idx) => (
                            <li key={idx} className="flex items-center">
                                <HiArrowRightCircle size='30px' />
                                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{item.role_name}</span>
                            </li>
                        ))
                    )}

                </ul>


            <Button gradientDuoTone='purpleToPink'  className='w-full' onClick={handleStripePayment}>
                Choose plan
            </Button>
            </div>
      </>
    )
}

export default SubscriptionCards