import React from 'react'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'
import RecruiterLogin from './components/RecruiterLogin'
import UserAuth from './components/UserAuth'
import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const {showRecruiterLogin, showUserAuth, companyToken} = useContext(AppContext);
  
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      {showUserAuth && <UserAuth />}
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
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