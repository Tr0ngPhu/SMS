const Subject = require('../models/SubjectSchema');
const Semester = require('../models/SemesterSchema')
const Semester_Subject = require('../models/Semester_SubjectSchema');
const { getSemester } = require('./semesterContronler');
const Curriculum = require('../models/CurriculumSchema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const subjectContronler= {


    checkAddSubject: async (req, res, next) => {
        try {
            const instanceFaculty = req.instanceFaculty;
            const majorInstance = req.majorInstance
            const instanceSemester = req.instanceSemester            
            const subjectInstance = req.subjectInstance
            console.log(subjectInstance)

            
            let curriculum= await Curriculum.findOne({ 
                semester: instanceSemester._id,
                faculty: instanceFaculty,
                major:majorInstance._id
             }).populate('subjects');

            req.curriculum = curriculum;
    
            let subjectExisted = curriculum.subjects.some(subject => subject.subject_code === subjectInstance?.subject_code);
            
            if (!subjectExisted) {
                return next();
            } else {
                return res.status(400).json({ message: 'môn học đã được thêm vào chương trình' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    
    addSubject: async (req, res) => {
        try {
            const curriculum = req.curriculum;
            const subjectInstance= req.subjectInstance
            curriculum.subjects.push(subjectInstance._id);
            await curriculum.save();
            console.log(curriculum)
            res.status(200).json({ message: 'Thêm môn học thành công' });
            
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    },
    createSubject: async(req, res)=>{
        try {
            const instanceFaculty = req.instanceFaculty
            const subject = new Subject({
                subject_name: req.body.subject_name,
                subject_code: req.body.subject_code,
                credits_number: req.body.credits_number,
                faculty:instanceFaculty._id
                
            });
            const subjectsave = await subject.save();
            res.status(200).json(subjectsave);

        } catch (error) {
            res.status(500).json(error);
        }
    },
    getSubjectByFaculty: async(req, res)=>{
        try {
            const instanceFaculty = req.instanceFaculty;
            const subject = await Subject.find({faculty: instanceFaculty._id});
            res.status(200).json(subject);
        } catch (error) {
            res.status(500).json(error)
        }
    },

  
    getCurriculum: async (req,res)=>{
        try {
            const instanceFaculty = req.instanceFaculty;
            const majorInstance = req.majorInstance
            const curriculum = await Curriculum.find({
                faculty:instanceFaculty._id,
                major:majorInstance._id
            })
            .populate('semester') 
            .populate({
                path: 'subjects', 
            });
            res.status(200).json(curriculum)
            
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    },


    deleteSubject: async (req, res) => {
        const subjectId = req.params.id; // Lấy id của môn học từ request parameters
    
        try {
            // Bước 1: Xóa môn học trong bảng Subject
            const deletedSubject = await Subject.findByIdAndDelete(subjectId);
            if (!deletedSubject) {
                return res.status(404).json({ message: 'Không tìm thấy môn học để xóa' });
            }
    
            // Bước 2: Cập nhật bảng Semester_Subject để xóa tham chiếu đến môn học này
            await Curriculum.updateMany(
                { subjects: subjectId },
                { $pull: { subjects: subjectId } }
            );
    
            res.status(200).json({ message: 'Xóa môn học thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi xóa môn học', error });
        }
    },

    removeCurriculumSubject: async(req,res)=>{
        try {
            const {curriculumId , subjectId} = req.params

            const updateCurriculum = await Curriculum.findByIdAndUpdate(
                curriculumId,
            { $pull: { subjects: new ObjectId(subjectId) } }, // Xóa trực tiếp ObjectId từ mảng subjects                { new: true }  
            )

            if(!updateCurriculum){
                return res.status(404).json({message: 'Không tìm thấy trương trình học'});
            }
            else{
                return res.status(200).json({message: 'xóa môn học thành công',updateCurriculum})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    updateSubject: async (req, res) => {
        const subjectId = req.params.id
        try {
            const updateData = {
                subject_name: req.body.subject_name,
                subject_code: req.body.subject_code,
                credits_number: req.body.credits_number
            }
            
            const updatedSubject = await Subject.findByIdAndUpdate(
                subjectId,
                updateData,
                { new: true, runValidators: true }
            );
            
            if (!updatedSubject) {
                return res.status(404).json({ message: 'Không tìm thấy môn học để sửa' });
            }
            
            res.status(200).json({message: 'Sửa môn học thành công'})
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi cập nhật môn học', error: error.message })
        }
    },

    // tìm kiếm môn học bằng id
    findSubjectById: async(req, res,next)=>{
        const subjectId = req.body.subject
        try {
            const subjectInstance = await Subject.findOne({subject_code:subjectId});
            if(!subjectInstance){
                return res.status(404).json({message:'không tìm thấy môn học'});
            }
            req.subjectInstance = subjectInstance
            next();
        } catch (error) {
            res.status(500).json(error);
        }
    },

    addSemesterToCurriculum: async(req,res)=>{
        try {
            const instanceFaculty = req.instanceFaculty;
            const majorInstance = req.majorInstance
            const instanceSemester = req.instanceSemester            

            
            let curriculum= await Curriculum.findOne({ 
                semester: instanceSemester._id,
                faculty: instanceFaculty,
                major:majorInstance._id
             })
            
            if (!curriculum) {
                curriculum = new Curriculum({
                    semester: instanceSemester._id,
                    faculty: instanceFaculty,
                    major:majorInstance._id,            
                    subjects: []
                });
                await curriculum.save();
                return res.status(200).json({message:'Thêm học kì vào chương trình thành công', curriculum});
            }else{
                return res.status(400).json({message:'Học kì đã được thêm vào chương trình'})
            }
            
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getCurriculumBySemester: async (req, res) => {
        try {
            const instanceSemester = req.instanceSemester;
            const student = req.user;
            const major = student.major;
    
            // Kiểm tra nếu người dùng không phải sinh viên
            if (student.role !== 'student') {
                return res.status(400).json({ message: 'người dùng không phải sinh viên' });
            }
    
            // Kiểm tra nếu không tìm thấy chuyên ngành
            if (!major) {
                return res.status(400).json({ message: 'không tìm thấy chuyên ngành' });
            }
    
            // Tìm curriculum theo học kỳ và chuyên ngành
            const curriculum = await Curriculum.findOne({
                semester: new ObjectId(instanceSemester._id),
                major: new ObjectId(major),
            }).populate('subjects');
    
            // Đảm bảo chỉ gửi phản hồi một lần
            if (!res.headersSent) {
                return res.status(200).json(curriculum);
            }
    
        } catch (error) {
            // Kiểm tra nếu phản hồi chưa được gửi trước khi gửi lỗi
            if (!res.headersSent) {
                return res.status(500).json({ message: error.message });
            }
        }
    }
    
};

module.exports= subjectContronler;