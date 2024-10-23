const mongoose = require('mongoose');

const ClassRoomSchema = new mongoose.Schema({
    classroom_id:{
        type: String,
        required:true,
        unique: true,
    },
    classroom_name:{
        type:String,
        required: true
    },
    room_type:{
        type: String, 
        required: true
    }
    
});

module.exports = mongoose.model('ClassRoom', ClassRoomSchema);