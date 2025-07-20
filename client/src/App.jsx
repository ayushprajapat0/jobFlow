import React from 'react'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'
import RecruiterLogin from './components/RecruiterLogin'
import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import Signup from './components/Signup'
import Signin from './components/Signin'
import 'quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const {showRecruiterLogin , companyToken} = useContext(AppContext);
  
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Application />} />
        <Route path='/dashboard' element={<Dashboard/>}>
          {companyToken ? <>
            <Route path='add-job' element={<AddJob/>}/>
            <Route path='manage-jobs' element={<ManageJobs/>}/>
            <Route path='view-applications' element={<ViewApplications/>}/> 
          </> : null}
        </Route>
      </Routes>
    </div>
  )
}

export default App