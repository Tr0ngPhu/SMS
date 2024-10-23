const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Semester_SubjectSechema = new mongoose.Schema({
    semester:{
        type: ObjectId,
        ref: 'Semester',
        required:true
    },
    subjects:[{
        type: ObjectId,
        ref: 'Subject',
    }]
})

module.exports = mongoose.model('Semester_Subject',Semester_SubjectSechema);