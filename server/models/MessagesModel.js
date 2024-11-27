import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    recipient :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: false,//as in case the recip is useritself and also the channel doesn't have a single recip
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true,
    },
    content:{
        type:String,
        required:function(){
            return this.messageType === "text";//if message type is of text then it is true it is file then false
        },
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType === "file";//if message type is of text then it is true it is file then false
        },
    },
    timestamp:{
        type:Date,
        default:Date.now,
    },

});

const Message = mongoose.model('Message', messageSchema);

export default Message;