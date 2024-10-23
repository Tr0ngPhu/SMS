const Semester = require('../models/SemesterSchema');

const semesterContronler = {

    addSemester:async(req, res)=>{
        try {
            const newSemester= new Semester({
                semester_id: req.body.semester_id,
                semester_name: req.body.semester_name,
                start_date: req.body.start_date,
                end_date: req.body.end_date
            });
    
            const semester = await newSemester.save();
            res.status(200).json(semester);
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    },

    findSemesterById: async ( req, res,next)=>{
        try {
            const instanceSemester =  await Semester.findOne({semester_id:req.body.semester_id});
            if(!instanceSemester){
                return res.status(404).json({message: ' không tìm thấy học kì'})
            }
            req.instanceSemester= instanceSemester
            next();
        } catch (error) {
          return  res.status(404).json(error)
        }
    },
    getSemester: async ( req, res)=>{
        try {
            const semester =  await Semester.find();
            res.status(200).json(semester)
        } catch (error) {
            res.status(404).json(error)
        }
    }
}


module.exports=  semesterContronler