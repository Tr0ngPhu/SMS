const Faculty = require('../models/FacultySchema');

const FacultyContronller = {

    checkFacultyExisted: async (req, res, next)=>{
        const facultyId = req.body.faculty_id
        try {
            const instanceFaculty = await Faculty.findOne({faculty_id: facultyId});
            if(!instanceFaculty){
                return res.status(404).json({message:'không tìm thấy khoa trong hệ thống.'});
            }
            req.instanceFaculty = instanceFaculty;
            next();
        } catch (error) {
            res.status(500).json(error);
            console.log(error)
        }
    },

    createFaculty: async (req, res) =>{
        try {
            const newFaculty = new Faculty({
                faculty_id: req.body.faculty_id,
                faculty_name: req.body.faculty_name
            });
            const savedFaculty = await newFaculty.save();
            res.status(200).json(savedFaculty)
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getFaculty: async(req, res)=>{
        try {
            const faculty = await Faculty.find();
            res.status(200).json(faculty);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteFaculty: async(req, res)=>{
        const facultyId = req.params.id
        try {
             await Faculty.findByIdAndDelete(facultyId)
            res.status(200).json({message: 'Xóa Thành công'});
        } catch (error) {
            res.status(500).json(error)
        }
    },



}

module.exports = FacultyContronller;