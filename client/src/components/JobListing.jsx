import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets, JobCategories, JobLocations} from '../assets/assets';
import JobCard from './JobCard';

const JobListing = () => {
    const {isSearched, searchFilter , setSearchFilter , jobs} = useContext(AppContext);

    const [showFilter , setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);

    const [filteredJobs, setFilteredJobs] = useState(jobs);

    const handleCategoryChange = (category) => {
        setSelectedCategory(prev => {
            if (prev.includes(category)) {
                return prev.filter(item => item !== category);
            } else {
                return [...prev, category];
            }
        });
    };
    const handleLocationChange = (location) => {
        setSelectedLocation(prev => {
            if (prev.includes(location)) {
                return prev.filter(item => item !== location);
            } else {
                return [...prev, location];
            }
        });
    };

    useEffect(() => {
        const matchedJobs = job => selectedCategory.length === 0 || selectedCategory.includes(job.category);

        const matchedLocation = job => selectedLocation.length === 0 || selectedLocation.includes(job.location);

        const matchedTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

        const matchedLocationFilter = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchedJobs(job) && matchedLocation(job) && matchedTitle(job) && matchedLocationFilter(job)
        );

        setFilteredJobs(newFilteredJobs);
        setCurrentPage(1);
    }, [jobs, selectedCategory, selectedLocation, searchFilter]);
  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col gap-4 p-4 lg:flex-row max-lg:space-y-8 py-8'>
        {/* sidebar */}
        <div className='w-full lg:w-1/4 bg-white px-4'>
            {/* searchcomponent */}
            {isSearched && (searchFilter.title || searchFilter.location) && (
                <>
                    <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                    <div className='mb-4 text-gray-600'>
                        {searchFilter.title && (
                        <span className='inline-flex gap-2.5 items-center bg-blue-50 border border-blue-200 px-4 py-1.5 rounded '>{searchFilter.title}
                        <img onClick={(e)=>setSearchFilter(prev => ({...prev, title: ""}))} 
                        className='cursor-pointer' src={assets.cross_icon} alt="" />
                        </span>
                    )}
                    {searchFilter.location && (
                        <span className=' ml-2 inline-flex gap-2.5 items-center bg-red-50 border border-red-200 px-4 py-1.5 rounded '>{searchFilter.location}
                        <img onClick={(e)=>setSearchFilter(prev => ({...prev, location: ""}))} 
                        className='cursor-pointer' src={assets.cross_icon} alt="" />
                        </span>
                    )}
                    </div>
                </>
            )}

            <button className='px-6 py-1.5 rounded border border-y-gray-400 lg:hidden' onClick={() => setShowFilter(!showFilter)}>
                {showFilter ? "Close" : "Filters"}
            </button>

            {/* categories */}
            <div className={showFilter ? "" : 'max-lg:hidden'}>
                <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                <ul className=' space-y-2 text-gray-600'>
                    {
                        JobCategories.map((category, index) => (
                            <li className='flex gap-3 items-center ' key={index}>
                                <input className='scale-125' type="checkbox" 
                                onChange={() => handleCategoryChange(category)}
                                checked = {selectedCategory.includes(category)}/>
                                {category}
                            </li>
                        ))
                    }
                </ul>
            </div>
            {/* Location */}
            <div className={showFilter ? "" : 'max-lg:hidden'}>
                <h4 className='font-medium text-lg py-4 pt-14'>Search by Location</h4>
                <ul className=' space-y-2 text-gray-600'>
                    {
                        JobLocations.map((location, index) => (
                            <li className='flex gap-3 items-center ' key={index}>
                                <input className='scale-125' type="checkbox" 
                                onChange={() => handleLocationChange(location)}
                                checked={selectedLocation.includes(location)}
                                />
                                {location}
                            </li>
                        ))
                    }
                </ul>
            </div>

            
        </div>
        {/* job listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4 '>
                <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
                <p className='mb-8'>Get your desired job from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  gap-4'>
                   {filteredJobs.slice((currentPage-1)*6,currentPage*6).map((job, index) => (
                       <JobCard key={index} job={job} />
                   ))} 
                </div>

                {/* pagination */}
                {filteredJobs.length > 0 && (
                    <div className='flex justify-center items-center  space-x-2 mt-10'>
                        <a href="#job-list">
                            <img onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} src={assets.left_arrow_icon} alt="" />
                        </a>
                        {Array.from({length: Math.ceil(filteredJobs.length / 6)}, (_, i) => (
                            <a href="#job-list" key={i}>
                                <button
                                    className={`w-10 h-10 flex justify-center items-center border border-gray-300 rounded ${currentPage === i + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </a>
                        ))}
                        <a href="#job-list">
                            <img onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )}
            </section>
    </div>
  )
}

export default JobListing