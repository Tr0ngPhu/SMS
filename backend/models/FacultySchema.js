const mongoose = require('mongoose');
 const FacultySchema = new mongoose.Schema({
    faculty_id: {
        type: String,
        required:true,
        unique:true
    },
    faculty_name:{
        type: String,
        required:true,
    }
 })

 module.exports = mongoose.model('Faculty', FacultySchema);