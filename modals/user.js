import mongoose from "mongoose";

const user =  new mongoose.Schema({

 email :{
    type : String,
    unique : true,
    required : [true , "email is required"]

 },
 password : {
    type : String,
    required : [true , "password is required"]
 }

},
{
   timestamps : true
}
)

export default mongoose.model("User",user)