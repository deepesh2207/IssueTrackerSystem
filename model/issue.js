const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open',
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'low'
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    }
}, {timestamps:true})

module.exports = mongoose.model("Issue", issueSchema);
