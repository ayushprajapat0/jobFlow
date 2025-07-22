import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', image: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {backendUrl} = useContext(AppContext);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(backendUrl+'/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setUser(data.user);
          setForm({ name: data.user.name, email: data.user.email, image: null });
        }
      } catch (err) {
        // handle error, maybe redirect to login
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (form.image) formData.append('image', form.image);
      const { data } = await axios.post(backendUrl+'/api/users/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUser(data.user);
        setEditMode(false);
      }
    } catch (err) {
      // handle error
    }
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setResumeUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const { data } = await axios.post(backendUrl + '/api/users/update-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        // Refetch user profile to update resume link
        const { data: profileData } = await axios.get(backendUrl + '/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileData.success) setUser(profileData.user);
        setResumeFile(null);
      }
    } catch (err) {
      // handle error
    } finally {
      setResumeUploading(false);
    }
  };

  // Helper to capitalize first letter
  const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  if (loading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>;
  if (!user) return <div className='flex justify-center items-center min-h-screen'>User not found</div>;

  return (
    <div className='fixed inset-0 z-30 flex justify-center items-center backdrop-blur-sm bg-black/25'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md relative'>
        <button
          onClick={() => navigate('/')}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none'
          aria-label='Close profile'
        >
          &#10005;
        </button>
        <div className='flex flex-col items-center mb-6'>
          <img src={user.image} alt='Profile' className='w-24 h-24 rounded-full object-cover border mb-2' />
          <h2 className='text-2xl font-semibold'>{capitalizeFirst(user.name)}</h2>
          <p className='text-gray-600'>{user.email}</p>
          {user.resume && !editMode && (
            <button
              className='mt-2 px-3 py-1 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-150'
              onClick={() => window.open(user.resume, '_blank', 'noopener noreferrer')}
            >
              See Resume
            </button>
          )}
        </div>
        {editMode ? (
          <>
            <form onSubmit={handleUpdate} className='space-y-4'>
              <div>
                <label className='block mb-1'>Name</label>
                <input type='text' name='name' value={form.name} onChange={handleChange} className='w-full border rounded px-3 py-2' required />
              </div>
              <div>
                <label className='block mb-1'>Email</label>
                <input type='email' name='email' value={form.email} onChange={handleChange} className='w-full border rounded px-3 py-2' required />
              </div>
              <div>
                <label className='block mb-1'>Profile Image</label>
                <input type='file' name='image' accept='image/*' onChange={handleChange} className='w-full' />
              </div>
            </form>
            <form onSubmit={handleResumeUpload} className='mt-6 flex flex-col items-center gap-2'>
              <label className='block w-full'>
                <span className='text-gray-700'>Update Resume (PDF):</span>
                <div className='relative mt-1'>
                  <input
                    type='file'
                    accept='application/pdf'
                    onChange={handleResumeChange}
                    className='opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer'
                    style={{ zIndex: 2 }}
                    id='resume-upload-input'
                  />
                  <label htmlFor='resume-upload-input' className='inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-center w-full'>
                    {resumeFile ? resumeFile.name : 'Choose File'}
                  </label>
                </div>
              </label>
              <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded w-full' disabled={resumeUploading || !resumeFile}>
                {resumeUploading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </form>
            <div className='flex gap-2 mt-8 w-full'>
              <button type='button' className='bg-blue-600 text-white px-4 py-2 rounded flex-1' onClick={handleUpdate}>Save</button>
              <button type='button' className='bg-gray-300 px-4 py-2 rounded flex-1' onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <div className='flex flex-col gap-2'>
            <button className='bg-blue-600 text-white px-4 py-2 rounded' onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 