import React, { useEffect } from 'react'
import Quill from 'quill';
import { useRef , useState } from 'react';
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AddJob = () => {
    const {backendUrl,companyToken} = useContext(AppContext)
    const [title, setTitle] = React.useState("");
    const [location, setLocation] = React.useState("Banglore");
    const [category, setCategory] = React.useState("Programming");
    const [level, setLevel] = React.useState("Entry Level");
    const [salary, setSalary] = React.useState(0);

    const editorRef = React.useRef(null);
    const quillRef = React.useRef(null);

    const onSubmitHandler = async (e)=>{

        e.preventDefault()

        try {
            
            const description = quillRef.current.root.innerHTML

            const {data} = await axios.post(backendUrl + '/api/company/post-job' , {
                title,
                description,
                location,
                salary,
                category,
                level
            },{headers:{Authorization: `Bearer ${companyToken}`}})

            if(data.success){
                toast.success(data.message);
                setTitle('')
                setSalary(0)
                quillRef.current.root.innerHTML = ""
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }

    }

    useEffect(() => {
        //init quill only once
        if(!quillRef.current && editorRef.current){
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            });
        }
    }, [])

  return (
    <form onSubmit={onSubmitHandler} className='constainer p-4 flex w-full flex-col gap-3 items-start' >
        <div className='w-full'>
            <p className='mb-2'>Job Title</p>
            <input type="text" placeholder='Type Here' onChange={e=>setTitle(e.target.value)} value={title} required
            className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded '/>
        </div>

        <div className='w-full max-w-lg'>
            <p className='my-2'>Job Description</p>
            <div ref={editorRef}>

            </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
                <p className='mb-2'>Job Categories</p>
                <select className='w-full px-3 py-2 border border-gray-300 rounded' onChange={e=>setCategory(e.target.value)} value={category}>
                    {JobCategories.map((category, index) => (<option key={index} value={category}>{category}</option>))}
                </select>
            </div>
        
         
            <div>
                <p className='mb-2'>Job Location</p>
                <select className='w-full px-3 py-2 border border-gray-300 rounded' onChange={e=>setLocation(e.target.value)} value={location}>
                    {JobLocations.map((location, index) => (<option key={index} value={location}>{location}</option>))}
                </select>
            </div>


            <div>
                <p className='mb-2'>Job Level</p>
                <select className='w-full px-3 py-2 border border-gray-300 rounded' onChange={e=>setLevel(e.target.value)} value={level}>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Intermediate Level</option>
                    <option value="Senior Level">Senior Level</option>
                </select>
            
            </div>
        </div>
        <div>
            <p className='mb-2'>Job Salary</p>
            <input className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]' type="number" onChange={e=>setSalary(e.target.value)} value={salary} min={0}/>
        </div>
        <button className='w-28 py-3 mt-4 bg-black text-white rounded'>ADD</button>
    </form>
  )
}

export default AddJob