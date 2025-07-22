import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const UserAuth = () => {
    const navigate = useNavigate();
    const { backendUrl, setUserData, setIsAuthenticated, setShowUserAuth } = useContext(AppContext);
    const [state, setState] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [isNextDataSubmitted, setIsNextDataSubmitted] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (state == 'signup' && !isNextDataSubmitted) {
            return setIsNextDataSubmitted(true);
        }

        // Require image for signup
        if (state === 'signup' && isNextDataSubmitted && (!image || !(image instanceof File))) {
            toast.error('Please select a profile image!');
            return;
        }

        try {
            if (state === "login") {
                const { data } = await axios.post(backendUrl + '/api/users/signin', { email, password });

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    toast.success(data.message)
                    setUserData(data.user);
                    setIsAuthenticated(true);
                    setShowUserAuth(false);
                    navigate('/');
                } else {
                    toast.error(data.message)
                }
            } else {
                const formData = new FormData()
                formData.append('name', name)
                formData.append('password', password)
                formData.append('email', email)
                if (image && image instanceof File) {
                    formData.append('image', image)
                }

                const { data } = await axios.post(backendUrl + '/api/users/signup', formData)

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    toast.success(data.message)
                    setUserData(data.user);
                    setIsAuthenticated(true);
                    setShowUserAuth(false);
                    navigate('/');
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    })

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/25 flex justify-center items-center'>
            <form className='relative bg-white p-10 rounded-xl shadow-lg text-slate-500' onSubmit={onSubmitHandler}>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>User {state}</h1>
                <p className='text-sm'>Welcome Back! Please enter your details here</p>
                
                {state === 'signup' && isNextDataSubmitted ? (
                    <>
                        <div className='flex items-center gap-4 my-5'>
                            <label htmlFor="image">
                                <img className='w-16 h-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden accept="image/*" required />
                            </label>
                            <p>Upload Profile <br />Picture</p>
                        </div>
                    </>
                ) : (
                    <>
                        {state !== 'login' && (
                            <div className='flex items-center gap-2 border px-4 py-2 rounded-full mt-5'>
                                <img src={assets.person_icon} alt="" />
                                <input className='outline-none text-sm' onChange={e => setName(e.target.value)} 
                                    value={name} type="text" placeholder='Full Name' required />
                            </div>
                        )}
                        
                        <div className='flex items-center gap-2 border px-4 py-2 rounded-full mt-5'>
                            <img src={assets.email_icon} alt="" />
                            <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} 
                                value={email} type="email" placeholder='Email' required />
                        </div>
                        
                        <div className='flex items-center gap-2 border px-4 py-2 rounded-full mt-5'>
                            <img src={assets.lock_icon} alt="" />
                            <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} 
                                value={password} type="password" placeholder='Password' required />
                        </div>
                    </>
                )}
                
                {state === 'login' && <p className='text-sm text-blue-600 cursor-pointer mt-4'>Forgot Password?</p>}
                
                <button type='submit' className='bg-blue-600 text-white w-full mt-4 py-2 rounded-full'>
                    {state === 'login' ? 'Login' : isNextDataSubmitted ? 'Create Account' : 'Next'}
                </button>

                {state === 'login' ? (
                    <p className='mt-5 text-center'>Don't have an account <span className='text-blue-600 cursor-pointer' onClick={() => setState('signup')}>Sign Up</span></p>
                ) : (
                    <p className='mt-5 text-center'>Already have an account <span className='text-blue-600 cursor-pointer' onClick={() => setState('login')}>Login</span></p>
                )}

                <img onClick={() => setShowUserAuth(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />
            </form>
        </div>
    )
}

export default UserAuth 