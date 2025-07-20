import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [companyToken, setcompanyToken] = useState(null);
  const [companyData, setcompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(user));
    }
  }, []);

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const { data } = await axios.get(backendUrl + '/api/jobs');

      if (data.success) {
        setJobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setJobsLoading(false);
    }
  };

  //to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/company', { 
        headers: { 
          Authorization: `Bearer ${companyToken}` 
        } 
      })
      if (data.success) {
        setcompanyData(data.company)
        console.log(data);
      }
      else {
        // If company not found, clear the invalid token
        if (data.message === "Company not found") {
          localStorage.removeItem('companyToken');
          setcompanyToken(null);
          setcompanyData(null);
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      // If there's a network error or invalid token, clear it
      if (error.response?.status === 401 || error.message.includes('token')) {
        localStorage.removeItem('companyToken');
        setcompanyToken(null);
        setcompanyData(null);
      } else {
        toast.error(error.message)
      }
    }
  };

  //fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const { data } = await axios.get(backendUrl + '/api/users/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error(data.message);
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error(error.message);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const { data } = await axios.get(backendUrl + '/api/users/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserApplications(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
    setIsAuthenticated(false);
    setUserApplications([]);
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem('companyToken')
    if (storedCompanyToken) {
      setcompanyToken(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData()
    }
  }, [companyToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [isAuthenticated]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    jobsLoading,
    showRecruiterLogin,
    setShowRecruiterLogin,
    showUserAuth,
    setShowUserAuth,
    companyToken,
    setcompanyToken,
    companyData,
    setcompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};