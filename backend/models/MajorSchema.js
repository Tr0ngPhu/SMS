const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const MajorSchema = new mongoose.Schema({
    major_id:{
        type: String,
        unique: true,
        required:true,
    },
    major_name:{
        type:String,
        required: true
    },
    faculty:{
        type: ObjectId, 
        ref: 'Faculty'
    }
    
});

module.exports = mongoose.model('Major', MajorSchema);