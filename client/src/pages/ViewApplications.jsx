import React, { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const ViewApplications = () => {

    const {backendUrl , companyToken}=useContext(AppContext);

    const [applications, setApplications] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCompanyJobApplications=async()=>{
        try {
            setLoading(true);
            const {data} = await axios.get(backendUrl+'/api/company/applicants',
                {headers : {
                    Authorization : `Bearer ${companyToken}`
                }}
            )

            if(data.success){
                setApplications(data.applications.reverse());
                console.log(applications);
            }else{
                toast.error(data.message);
                setApplications([]);
            }
        } catch (error) {
            toast.error(error.message);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };
    const changeJobApplicationStatus=async(id,status)=>{
        try{
            const {data} = await axios.post(backendUrl+'/api/company/change-status',{
                id,
                status
            },{
                headers : {
                    Authorization : `Bearer ${companyToken}`
                }
            })

            if(data.success){
                toast.success(data.message);
                fetchCompanyJobApplications();
            }else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(companyToken){
            fetchCompanyJobApplications();
        }
    },[companyToken]);

  if (loading) {
    return <Loading />
  }

  if (!applications || applications.length === 0) {
    return (
      <div className='flex justify-center items-center h-[70vh]'>
        <p className='text-xl font-medium'>No Applications Found</p>
      </div>
    )
  }

  return (
    <div className='container p-4 mx-auto'>
        <div >
            <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr className='border-b border-gray-200'>
                        <th className='py-2 px-4 text-left'>#</th>
                        <th className='py-2 px-4 text-left'>Username</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
                        <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
                        <th className='py-2 px-4 text-left'>Resume</th>
                        <th className='py-2 px-4 text-left'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.filter(item => item.jobId && item.userId).map((application, index) => (
                        <tr key={index} className='text-gray-700'>
                            <td className='py-2 px-4 border-b text-center border-gray-200'>{index + 1}</td>
                            <td className='py-2 px-4 border-b flex border-gray-200 mt-2'>
                                <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={application.userId.image} alt="" />
                                <span>{application.userId.name}</span>
                            </td>
                            <td className='py-2 px-4 border-b max-sm:hidden border-gray-200'>{application.jobId.title}</td>
                            <td className='py-2 px-4 border-b max-sm:hidden border-gray-200'>{application.jobId.location}</td>
                            <td className='py-2 px-4 border-b border-gray-200'>
                                {application.userId.resume ? (
                                    <button
                                        className='px-3 py-1 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-150'
                                        onClick={() => window.open(application.userId.resume, '_blank', 'noopener noreferrer')}
                                    >
                                        See Resume
                                    </button>
                                ) : (
                                    <span className='text-gray-400'>No Resume</span>
                                )}
                            </td>
                            <td className='py-2 px-4 border-b relative border-gray-200'>
                                {application.status === 'Pending' ?<div className='relative inline-block text-left group '>
                                    <button className='text-gray-500  action-button' >...</button>
                                    <div className='z-10 hidden absolute right-0 left-0 top-0 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                                        <button onClick={()=>changeJobApplicationStatus(application._id,'accepted')} className=' block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                                        <button onClick={()=>changeJobApplicationStatus(application._id,'rejected')} className=' block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                                    </div>
                                </div>
                                :
                                <div>
                                    {application.status ==='accepted' ?
                                    <span className='text-green-500'>Accepted</span> : <span className='text-red-500'>Rejected</span> }
                                </div>
                                }
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ViewApplications