import React, { useContext, useRef, useState, useEffect } from 'react'
import {assets} from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const { userData, isAuthenticated, logout, setShowRecruiterLogin, setShowUserAuth } = useContext(AppContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='shadow py-4'>
            <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <img onClick={() => { navigate('/') }} className='cursor-pointer h-10 w-10' src={assets.favicon} alt="" />
                    <p className='text-2xl font-bold'>job<span className='text-blue-600'>Flow</span></p>
                </div>
                {isAuthenticated && userData ? (
                    <div className='flex items-center gap-3'>
                        <Link to={'/applications'}>Applied Jobs</Link>
                        <p>|</p>
                        <div className='relative' ref={dropdownRef}>
                            <div className='flex items-center gap-2 cursor-pointer max-sm:hidden' onClick={() => setDropdownOpen((prev) => !prev)}>
                                <p>Hi, {userData.name}</p>
                                <img src={userData.image} alt="profile" className='w-8 h-8 rounded-full border border-gray-300 object-cover'/>
                            </div>
                            {dropdownOpen && (
                                <div className='absolute block top-8 right-0 z-10 text-black rounded pt-2 min-w-[140px]'>
                                    <ul className='list-none m-0 p-2 bg-white rounded-md border border-gray-200 text-sm shadow-lg'>
                                        <li onClick={() => { setDropdownOpen(false); navigate('/profile'); }} className='py-1 px-2 cursor-pointer hover:bg-gray-100 rounded'>View Profile</li>
                                        <li onClick={() => { setDropdownOpen(false); handleLogout(); }} className='py-1 px-2 cursor-pointer hover:bg-gray-100 rounded'>Logout</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='flex gap-4 mx-sm:text-xs'>
                        <button 
                            onClick={(e) => setShowRecruiterLogin(true)} 
                            className='text-gray-600'
                        >
                            Recruiter Login
                        </button>
                        <button 
                            onClick={() => setShowUserAuth(true)} 
                            className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar