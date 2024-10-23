const Major = require('../models/MajorSchema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const MajorContronller = {
    createMajor: async (req, res)=>{
        try {
            const instanceFaculty = req.instanceFaculty
            const newMajor = new Major({
                major_id:req.body.major_id,
                major_name: req.body.major_name,
                faculty: instanceFaculty._id
            });
            const savedMajor = await newMajor.save();

            res.status(200).json(savedMajor);

        } catch (error) {
            res.status(500).json(error)
            console.log(error)
        }
    },
    getMajorsByFaculty: async (req, res) => {
        try {
            const result = await Major.aggregate([
                {
                    // Nối với bảng Faculty để lấy thông tin chi tiết về khoa
                    $lookup: {
                        from: 'faculties', // Tên của bảng khoa trong MongoDB
                        localField: 'faculty',
                        foreignField: '_id',
                        as: 'faculty'
                    }
                },
                {
                    // Giải nén mảng faculty ra đối tượng (do lookup tạo ra mảng)
                    $unwind: '$faculty'
                },
                {
                    // Nhóm theo khoa
                    $group: {
                        _id: '$faculty._id', // Nhóm theo ID của khoa
                        facultyName: { $first: '$faculty.faculty_name' }, // Lấy tên khoa
                        majors: { $push: {_id:'$_id', major_id: '$major_id', major_name: '$major_name' } } // Danh sách chuyên ngành của từng khoa
                    }
                }
            ]);
    
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    },


    getMajorsByFacultyId: async (req,res)=>{
        try {
            const instanceFaculty= req.instanceFaculty;
            const majors = await Major.find({faculty: new ObjectId(instanceFaculty._id)})

            res.status(200).json(majors)
            
        } catch (error) {
            res.status(500).json(error)
        }
    },
    
    deleteMajor: async(req, res )=>{
        const id = req.params.id
        try {
           const major=  await Major.findOneAndDelete({_id:new ObjectId(id)})
            res.status(200).json({message: 'Xóa thành công'})
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    },

    findMajorById: async(req, res,next)=>{
        const majorId = req.body.major
        try {
            const majorInstance = await Major.findOne({major_id:majorId});
            if(!majorInstance){
                return res.status(404).json({message:'không tìm thấy chuyên ngành'});
            }
            req.majorInstance = majorInstance
            next();
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }
}


module.exports = MajorContronller