import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center py-3 mt-20'>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-2'>
          <img className='h-8 w-8' src={assets.favicon} alt="" />
          <p className='text-2xl font-bold'>job<span className='text-blue-600'>Flow</span></p>
        </div>
        <p className='border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>© 2025 jobFlow. All rights reserved.</p>
      </div>
      <div className='flex gap-2.5 '>
        <img width={38} src={assets.facebook_icon} alt="" />
        <img width={38} src={assets.instagram_icon} alt="" />
        {/* <img width={38} src={assets.linkedin_icon} alt="" /> */}
      </div>
    </div>
  )
}

export default Footer