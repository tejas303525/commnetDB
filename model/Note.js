const mongoose=require('mongoose')
const Schema=mongoose.Schema
const AutoIncrement=require("mongoose-sequence")(mongoose)


const noteSchema=new Schema(
    {
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    },
    title:{
        type: String,
        require:true
    },
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)
noteSchema.plugin(AutoIncrement,{
    inc_field:"ticket",
    id:"ticketNums",
    start_seq:500
})
module.exports=mongoose.model('Note',noteSchema)