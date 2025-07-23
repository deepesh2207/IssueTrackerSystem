const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    issues:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Issue'
    }],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    
},{timestamps:true})

module.exports = mongoose.model("Project", projectSchema);
