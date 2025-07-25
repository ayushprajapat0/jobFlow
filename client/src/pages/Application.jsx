import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Application = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications, isAuthenticated } = useContext(AppContext);

  const updateResume = async () => {
    try {
      const formData = new FormData();
      formData.append('resume', resume);

      const token = localStorage.getItem('token');

      const { data } = await axios.post(backendUrl + '/api/users/update-resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }

    setIsEdit(false);
    setResume(null);
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserApplications();
    }
  }, [isAuthenticated]);

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex mb-6 gap-2 mt-3'>
          {
            isEdit || (userData && userData.resume === "") ?
              <>
                <label className='flex items-center' htmlFor="resumeUpload">
                  <p className='bg-blue-100 text-blue-500 px-4 py-2 rounded-lg mr-2 '>{resume ? resume.name : "Select Resume"}</p>
                  <input id='resumeUpload' onChange={(e) => setResume(e.target.files[0])} accept='application/pdf' type='file' hidden />
                  <img src={assets.profile_upload_icon} alt="" />
                </label>
                <button onClick={updateResume} className='bg-green-100 border-green-400 rounded-lg px-4 py-2'>Save</button>
              </>
              :
              userData && userData.resume ? (
                <div className='flex gap-2'>
                  <a className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' target='_blank' href={userData.resume} rel="noopener noreferrer">
                    Resume
                  </a>
                  <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>Edit</button>
                </div>
              ) : null
          }
        </div>


        <h2 className='text-xl font-semibold mb-4'>Job Applied</h2>
        <table className='min-w-full bg-white shadow-md rounded-lg border border-gray-200'>
          <thead>
            <tr>
              <th className='py-3 px-4 border-b border-gray-200 text-left'>Comapny</th>
              <th className='py-3 px-4 border-b border-gray-200 text-left'>Job Title</th>
              <th className='py-3 px-4 border-b border-gray-200 text-left max-sm:hidden'>Location</th>
              <th className='py-3 px-4 border-b border-gray-200 text-left max-sm:hidden'>Date</th>
              <th className='py-3 px-4 border-b border-gray-200 text-left'>Status</th>
            </tr>
          </thead>
          <tbody>
            {userApplications.map((job, index) => (
              true ? (
                <tr key={index}>
                  <td className='py-3 px-4 border-b border-gray-200 flex items-center gap-2'>
                    <img className='w-8 h-8' src={job.companyId.image} alt="" />
                    {job.companyId.name}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200'>
                    {job.jobId.title}
                  </td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{job.jobId.location}</td>
                  <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{moment(job.date).format('ll')}</td>
                  <td className='py-2 px-4 border-b border-gray-200'>
                    <span className={`${job.status === 'accepted' ? 'bg-green-100' : job.status === 'rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded `}>{job.status}</span>
                  </td>
                </tr>
              ) : (null)
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  )
}

export default Application