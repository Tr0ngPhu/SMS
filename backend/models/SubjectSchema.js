const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const SubjectSchema = new mongoose.Schema({
    subject_name : {type: String, unique: true, required: true},
    subject_code: {type : String, unique: true, required: true},
    credits_number: {type: Number, min : 1, required: true},
    faculty:{type: ObjectId, ref: 'Faculty', required:true},
})  

module.exports = mongoose.model('Subject', SubjectSchema)