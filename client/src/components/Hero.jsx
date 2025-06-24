import React, { useRef, useContext } from 'react'
import { assets } from '../assets/assets'
import {AppContext} from '../context/AppContext';

const Hero = () => {
    const {setSearchFilter, setIsSearched} = useContext(AppContext);
    const titleref = useRef(null);
    const locationref = useRef(null);

    const onSearch = () => {
        setSearchFilter({
            title: titleref.current.value,
            location: locationref.current.value,
        });
        setIsSearched(true);
        console.log("Search Filter:", {
            title: titleref.current.value,
            location: locationref.current.value,
        });
    }

  return (
    <div className='container  2xl:px-20 mx-auto my-10'>
        <div className='bg-gradient-to-r from-blue-500 to-blue-900 text-white text-center py-16 mx-2 rounded-xl'>
            <h2 className='text-2xl md:text-3xl font-medium mb-4 lg:text-4xl'>Find Your Dream Job</h2>
            <p className='mb-8 max-w-xl mx-auto font-light text-sm px-5'>Explore thousands of job opportunities and kickstart your career.</p>
            <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
                <div className='flex items-center'>
                    <img className='h-4 sm:h-5' src={assets.search_icon} alt="" />
                    <input type="text" 
                    placeholder='Search for jobs...' 
                    className='max-sm:text-xs p-2 rounded outline-none w-full' 
                    ref={titleref}
                    />
                </div>
                <div className='flex items-center'>
                    <img className='h-4 sm:h-5' src={assets.location_icon} alt="" />
                    <input type="text" 
                    placeholder='Search for Location...' 
                    className='max-sm:text-xs p-2 rounded outline-none w-full' 
                    ref={locationref}
                    />
                </div>
                <button onClick={onSearch} className='px-6 py-2 text-blue-600 m-1'>Search</button>
            </div>
        </div>
        {/* <div className='border-t border-gray-300 shadow-md mx-2 mt-5
        p-6 rounded-md flex '>
            <div className='flex justify-center gap-8 lg:gap-10 flex-wrap'>
                <p className='font-medium'>Trusted By </p>
                <img className='h-6' src={assets.microsoft_logo} alt="" />
                <img className='h-6' src={assets.walmart_logo} alt="" />
                <img className='h-6' src={assets.accenture_logo} alt="" />
                <img className='h-6' src={assets.samsung_logo} alt="" />
                <img className='h-6' src={assets.amazon_logo} alt="" />
                <img className='h-6' src={assets.adobe_logo} alt="" />
            </div>
        </div> */}
    </div>
  )
}

export default Hero