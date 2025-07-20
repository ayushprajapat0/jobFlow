import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const { userData, isAuthenticated, logout, setShowRecruiterLogin, setShowUserAuth } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className='shadow py-4'>
            <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
                <img onClick={() => { navigate('/') }} className='cursor-pointer' src={assets.logo} alt="" />
                {isAuthenticated && userData ? (
                    <div className='flex items-center gap-3'>
                        <Link to={'/applications'}>Applied Jobs</Link>
                        <p>|</p>
                        <p className='max-sm:hidden'>Hi, {userData.name}</p>
                        <button 
                            onClick={handleLogout}
                            className='bg-red-600 text-white px-4 py-2 rounded-full text-sm'
                        >
                            Logout
                        </button>
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