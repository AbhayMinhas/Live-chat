import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response, next) => {
  try {
    const {searchTerm} = request.body;

    if(searchTerm === undefined || searchTerm === null){
        return response.status(400).send("searchTerm is required.");
    }

    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");//regex to remove all the special characters form the string
    const regex = new RegExp(sanitizedSearchTerm,"i");//sanitized search term is regex

    const contacts = await User.find({
        $and: [{ _id: {$ne:request.userId }},{$or: [{firstName:regex},{lastName:regex},{email:regex}]}]
    })//if id is not equal to user id then have that contact if id is same as req.userid then dont have that contact if search contacts then the current logd in user should not be there. $ne means not equal
    return response.status(200).json({contacts});
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const getContactsForDMList = async (request, response, next) => {
  try {
   let {userId} = request;
    
  userId=new mongoose.Types.ObjectId(userId);
  const contacts = await Message.aggregate([{
    $match:{
      $or: [{sender:userId},{recipient:userId}],
    },
  },
  {
    $sort:{timestamp:-1},
  },
  {
    $group:{
      _id:{
        $cond:{
          if:{$eq:["$sender",userId]},//id is going to be if the sender is this userid we need recipient and vice versa
          then:"$recipient",
          else:"$sender",
        },
      },
      lastMessageTime:{$first:"$timestamp"},
    }
  },
  {$lookup:{
    from:"users",//getting the contact info from the messages 
    localField:"_id",
    foreignField:"_id",
    as:"contactInfo",//matching the sender and teh recipient of the message with userid and storting it acc to time stamp and then we are grouping it with condition 
  },
},
{
  $unwind:"$contactInfo",
},
{
  $project:{
    _id:1,
    lastMessageTime:1,
    email:"$contactInfo.email",
    firstName:"$contactInfo.firstName",
    lastName:"$contactInfo.lastName",
    image:"$contactInfo.image",
    color:"$contactInfo.color",
  },
},
{
  $sort:{
    lastMessageTime:-1,

  },
},

]);//to find multiple contacts its like pipeline of queries

    return response.status(200).json({contacts});
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
