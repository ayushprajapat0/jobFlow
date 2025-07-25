import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

const JobCard = ({job}) => {

  const navigate = useNavigate();
  return (
    <div className='border border-gray-600 p-6 shadow rounded'>
        <div className='flex items-center justify-between '>
            <img className='h-8' src={job.companyId.image} alt="" />
        </div>
        <h4 className='font-medium text-xl mt-2'>{job.title}</h4>
        <div className='flex items-center gap-3 text-sm mt-2'>
            <span className='bg-blue-50 border-blue-200 px-4 py-1.5 rounded '>{job.location}</span>
            <span className='bg-red-50 border-red-200 px-4 py-1.5 rounded '>{job.level}</span>
        </div>
        <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{ __html: job.description.slice(0,150) }} />
        <div className='flex gap-4 text-sm mt-4'>
            <button onClick={()=>{navigate(`/apply-job/${job._id}`);scrollTo(0,0)}} className='bg-blue-600 text-white px-4 py-2 rounded'>Apply Now</button> 
            <button onClick={()=>{navigate(`/apply-job/${job._id}`);scrollTo(0,0)}} className='text-gray-600 border border-gray-600 px-4 py-2 rounded'>Learn More</button>
        </div>
    </div>
  )
}

export default JobCard