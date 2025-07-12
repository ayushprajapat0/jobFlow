import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const {user} = useUser();
  const {getToken} = useAuth();
  const [isSearched, setIsSearched] = useState(false);

  const [jobs , setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken , setcompanyToken]=useState(null);

  const [companyData , setcompanyData]=useState(null);

  const [userData, setUserData] = useState(null);
const [userApplications, setUserApplications] = useState([]);


  const fetchJobs = async ()=>{
    try {
      const {data}=await axios.get(backendUrl + '/api/jobs');

      if(data.success){
        setJobs(data.jobs);
        console.log(data.jobs);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  //to fetch company data
  const fetchCompanyData= async ()=>{
    try {
      const {data} = await axios.get(backendUrl + '/api/company/company',{headers : {token:companyToken}})
      if(data.success){
        setcompanyData(data.company)
        console.log(data);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
    //fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/users/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }

    }catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserApplications = async ()=>{
    try {
      const token = await getToken();

      const {data} = await axios.get(backendUrl + '/api/users/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(data.success){
        setUserApplications(data.applications);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message); 
    }
  }

  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem('companyToken')
    if(storedCompanyToken){
      setcompanyToken(storedCompanyToken);
    }
  }, [])

  useEffect(()=>{
    if(companyToken){
      fetchCompanyData()
    }
  },[companyToken]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);


  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
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
    
  };
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};