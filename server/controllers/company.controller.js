import Company from "../models/Company.js"
import JobApplication from "../models/JobApplication.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary} from 'cloudinary';
import { generateToken } from "../utils/generateToken.js";
import Job from '../models/Job.js'

//reg new company
export const registerCompany=async (req,res)=>{

    const {name , email , password }=req.body

    const imageFile = req.file;

    if(!name || !email || !password || !imageFile){
        return res.json({success:false, message:"missing details"});
    }

    try{

        const companyExist = await Company.findOne({email});

        if(companyExist){
            return res.json({success:false, message:"Company already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password,salt);

        const imgUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            password:hashPass,
            image:imgUpload.secure_url
        })

        res.json({success:true,
            comapny :{
                _id : company._id,
                name : company.name,
                email : company.email,
                image : company.image
        },
        token:generateToken(company._id)
    })

    }catch(err){
        res.json({success:false , message : err.message});
    }

}
//company login
export const loginCompany = async (req,res)=>{

    const {email,password}=req.body
    try {

        const company = await Company.findOne({email})

        if(!company){
            return res.json({success:false, message:"Invalid email or password"});
        }

        if( await bcrypt.compare(password,company.password)){
            res.json({success:true , company :{
                _id : company._id,
                name : company.name,
                email : company.email,
                image : company.image
        },
        token:generateToken(company._id)
                 })
        }else{
            res.json({success:false,message:"invalid email and password"})
        }
        
    } catch (error) {
            res.json({success:false,message:error.message});

    }

}

//get company data 
export const getCompanyData = async (req,res)=>{
    try {
        const company = await Company.findById(req.userId);
        if (!company) {
            return res.json({success: false, message: "Company not found"});
        }
        res.json({success: true, company});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

//post a new job
export const postJob = async (req,res)=>{
    const { title, description, location, salary,category,level}=req.body;
    const companyId = req.userId;

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date : Date.now(),
            category,
            level
        })

        await newJob.save();

        res.json({success:true , newJob});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

//get company job applicants
export const getCompanyJobApplicants = async (req,res)=>{
    try {
        const companyId = req.userId;
        //find applications for user and pupulate related data
        const applications = await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec();

        return res.json({success:true , applications});
    } catch (error) {
        return res.json({success:false , message:error.message});
    }
}

//get company posted jobs
export const getCompanyPostedJobs = async (req,res)=>{
    try {
        const companyId = req.userId;

        const jobs = await Job.find({companyId});

        const jobsData = await Promise.all(jobs.map(async(job)=>{
            const applicants = await JobApplication.find({jobId:job._id});
            return {...job.toObject(),
                applicants : applicants.length,
            }
        }))

        res.json({success : true , jobsData : jobsData});
    } catch (error) {
        res.json({success : false , message : error.message})
    }
}

//change job application status
export const changeJobApplicationStatus = async (req,res)=>{
    const {id,status}=req.body;
    try{
        await JobApplication.findOneAndUpdate({_id:id},{status});
        res.json({success:true , message:"Application status updated"});
    } catch (error) {
        res.json({success:false , message:error.message});
    }
}

//change job visibility
export const chnageJobVisibility = async (req,res)=>{
    try {
        const {id} = req.body;
        const companyId = req.userId;

        const job = await Job.findById(id);

        if(companyId.toString() === job.companyId.toString()){
            job.visible = !job.visible
        }

        await job.save()

        res.json({success:true , job});
    } catch (error) {
        res.json({success:false , message:error.message});
    }
}