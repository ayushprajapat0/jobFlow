import Job from "../models/Job.js"




//get all jobs
export const getJobs = async (req,res)=>{
    try {
        const jobs = await Job.find({visible:true})
        .populate({path:'companyId',select : '-password'});

        res.json({success:true , jobs})

    } catch (error) {
         res.json({success:false , message:error.message})
    }

}

//get single job by id
export const getJobsbyId = async (req,res)=>{

    try {
        const {id} =req.params
        const job = await Job.findById(id)
        .populate({path:'companyId',select : '-password'});

        if(!job){
            return res.json({success : false , message : "Job Not Found" });
        }
        res.json({success : true , job });
    } catch (error) {
        res.json({success : false , message : error.message });
    }

}