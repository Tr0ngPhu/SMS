const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true,
    },
   
    admin: {
        type: Boolean,
        default: false,
    },
    role:{
        type: String, 
        enum: {
            values:['student' ,'teacher','admin'],
            message: 'Role {VALUE} is not supported'
        },
        required: true,
    },
    vnu_id: {
        type: String,
        required: true,
        unique: true,
    },
    gender:{type: String,
        enum: {
            values:['male', 'female'],
            message: 'Gender {VALUE} is not supported'
        },
        require: true,
        
    },
    phonenumber:{
        type:String,
        required: false,
        default:"chưa có số điện thoại"
    },
    date_of_birth: {type: String, default: new Date().getTime()},
    // location:{type:String, required:true }
    major:{
        type: ObjectId,
        ref: 'Major'
    },
    faculty:{
        type: ObjectId,
        ref: 'Faculty'
    },
    

    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
