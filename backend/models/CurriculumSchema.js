const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const CurriculumSchema = new mongoose.Schema({
    semester:{
        type: ObjectId,
        ref: 'Semester',
        required:true
    },
    faculty:{
        type: ObjectId, 
        ref: 'Faculty', 
        required:true
    },
    major:{
        type: ObjectId, 
        ref: 'Major', 
        required:true
    },
    subjects:[{
        type: ObjectId,
        ref: 'Subject',
    }]
})

module.exports = mongoose.model('Curriculum',CurriculumSchema);