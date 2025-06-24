import { Webhook } from "svix";
import User from "../models/User.js";

//api controller funcn to manage clerk with db
export const clerkWebhooks =async (req,res)=>{
    try{

        //svix instance with clerk secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //verifying headres

        await whook.verify(JSON.stringify(req.body),{
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"]
        })

        // getting data from req

        const {data , type}=req.body;
        //swich cases for diff events

        switch (type) {
            case 'user.created':{

                const userData = {
                    _id:data.id,
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    image : data.image_url,
                    resume : ''
                }

                await User.create(userData)
                res.json({})
                break;
            }
            case 'user.updated':{

                 const userData = {
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    image : data.image_url,
                }
                await User.findByIdAndUpdate(data._id,userData);
                res.json({})
                break;
                
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data._id);
                res.json({});
                break;
            }
               
        
            default:
                break;
        }



    }catch(err){
        console.log(err.message);
        res.json({success:false,message:'webhook error'})
    }
}