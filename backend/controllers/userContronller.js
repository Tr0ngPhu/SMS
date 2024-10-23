const User= require('../models/User');

const userContronller = {

    getAllUsers: async(req, res)=>{
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getUserIsTeacher : async (req, res)=>{
        try {
            const teacher = await User.find({role: 'teacher'});
            res.status(200).json(teacher);
        } catch (error) {
            res.status(404).json(error)
        }
    },
    deleteUser: async(req, res)=>{
        try {
            const user = await User.findByIdAndDelete();
            res.status(200).json('delete successfully!!');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateUser: async(req, res)=>{
        try {
            const user = await User.findByIdAndUpdate();
            res.status(200).json('update successfully!!');
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getProfile: async (req, res)=>{
        try {
            const user = req.user
            const profile = await User.findOne({_id:user.id })
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json(error)
        }
    },

    getProfileById: async(req,res)=>{
        try {
            const profile = await User.findOne({_id:req.body._id})
            res.status(200).json(profile)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    findTeacherById: async (req,res , next)=>{
        const teacherId = req.body.teacherId;
        try {
            const teacherInstance = await User.findOne({ vnu_id: teacherId, role: 'teacher'});
            if(!teacherInstance){
                return res.status(404).json({ message: 'teacher not found' })
            }
            console.log('teacher found:', teacherInstance);
            req.teacherInstance=teacherInstance;
            next();
        } catch (error) {
            return res.status(500).json(error);
        }
    },
   
}

module.exports= userContronller;