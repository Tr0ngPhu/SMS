const  Class = require('../models/ClassSchema');
const User = require('../models/User');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const classContronller = {
    createClass: async (req, res) => {
        try {
            const instanceFaculty = req.instanceFaculty
            const majorInstance =req.majorInstance
            // Kiểm tra vai trò của người dùng, chỉ admin mới có quyền tạo lớp
            if (!req.user.role == 'admin') {
                console.log('Permission denied: role != admin');
                return res.status(403).json({
                    status: "Error",
                    message: "Permission Denied: Only admins can create classes"
                });
            }
            // Lấy ID của giáo viên từ trường giáo viên đã xác định từ middleware
            const teacherId = req.teacherInstance._id;
            
            // Kiểm tra xem ID của giáo viên có tồn tại và hợp lệ không
            const teacher = await User.findById(teacherId);
            if (!teacher || teacher.role !== 'teacher') {
                return res.status(404).json('Invalid teacher ID');
            }
            // Tạo một lớp mới và gán ID của giáo viên vào lớp
            const newClass = new Class({
                class_id: req.body.class_id,
                class_name: req.body.class_name,
                faculty:instanceFaculty._id,
                major:majorInstance._id,
                class_teacher: teacherId
            });
    
            // Lưu lớp mới vào cơ sở dữ liệu
            const savedClass = await newClass.save();
    
            // Trả về thông tin của lớp học vừa được tạo
            return res.status(200).json(savedClass);
        } catch (error) {
            console.error('Error creating classroom:', error);
            return res.status(500).json({
                status: "Error",
                message: "Internal Server Error"
            });
        }
    },
    getClass: async (req, res) => {
        try {
            let classes ;
            const instanceFaculty = req.instanceFaculty
            if(req.user.role == 'admin' ){
                classes = await Class.find({faculty:instanceFaculty._id})
                .populate('class_teacher')
                .populate('major');
            }else if (req.user.role === 'teacher') {
                // Nếu là giáo viên, trả về các lớp mà giáo viên đó giảng dạy
                classes = await Classroom.find({class_teacher: req.user.id }).populate(`class_teacher`).populate(`students`);
            } else {
                return res.status(403).json("Access denied");
            }               
             // Thêm số lượng sinh viên vào từng lớp
                const classDataWithStudentCount = classes.map(classItem => ({
                    ...classItem.toObject(), // Chuyển đổi tài liệu mongoose sang đối tượng
                    studentCount: classItem.students.length 
                }));
                console.log(classDataWithStudentCount);
                res.status(200).json(classDataWithStudentCount);
        } catch (error) {
            console.error('Error while finding class:', error);
            res.status(500).json(error);
        }
    },
    
    findTeacherById: async (req,res , next)=>{
        const teacherId = req.params.teacherId;
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
   
    findClassById: async (req, res, next) => {
        const classId = req.params.classId;
        try {
            console.log('Finding class with ID:', classId); // Thêm log ở đây để ghi lại thông tin về lớp được tìm kiếm
            const classInstance = await Class.findOne({ class_id: classId });
            if (!classInstance) {
                console.log('Class not found with ID:', classId); // Ghi lại thông tin nếu không tìm thấy lớp
                return res.status(404).json({ message: 'Class not found' });
            }
            console.log('Class found:', classInstance); // Ghi lại thông tin nếu tìm thấy lớp
            req.classInstance = classInstance;
            next(); // Đảm bảo rằng bạn gọi next() ở đây
        } catch (error) {
            console.error('Error while finding class:', error); // Ghi lại thông tin nếu có lỗi xảy ra
            return res.status(500).json(error);
        }
    },
    deleteClass: async (req, res) => {
        try {
            const classInstance = req.classInstance;
            if (!classInstance) {
                return res.status(404).json('Class not found');
            }

            await Class.deleteOne({ class_id: classInstance.class_id }); // Sử dụng deleteOne để xóa lớp học
            return res.status(200).json('Delete class successfully');
        } catch (err) {
            console.error('Error while deleting class:', err); // Ghi log lỗi chi tiết
            return res.status(500).json('Delete failed');
        }
    },

    addStudentToClass: async (req, res) => {
        try {
           const studentId = req.body.studentId; 
           console.log('Student ID:', studentId); // Ghi lại thông tin về ID sinh viên 
            const student = await User.findOne({vnu_id:studentId});
            if (!student || student.role !== 'student') {
                console.log('User is not a student or not found'); // Ghi lại thông tin nếu người dùng không phải là sinh viên hoặc không tìm thấy
                return res.status(404).json('User is not a student');
            }

            const classInstance = req.classInstance; // Lấy classInstance từ req
            console.log('Class instance:', classInstance); // Ghi lại thông tin về instance của lớp
            // Kiểm tra nếu sinh viên đã thuộc về một lớp nào đó
            const existingClass = await Class.findOne({ students: student._id });
            if (existingClass) {
                console.log('Student is already in another class'); // Ghi lại thông tin nếu sinh viên đã thuộc về lớp khác
                return res.status(400).json('Student is already in another class');
            }
            // Kiểm tra xem sinh viên đã có trong lớp hay chưa
            if (classInstance.students.includes(student._id)) {
                console.log('Student is already in the class'); // Ghi lại thông tin nếu sinh viên đã có trong lớp
                return res.status(400).json('Student is already in the class');
            }

            // Thêm sinh viên vào lớp
            classInstance.students.push(student._id);

            await classInstance.save();
            console.log('Student added to class successfully'); // Ghi lại thông tin nếu sinh viên được thêm vào lớp thành công
            return res.status(200).json(classInstance);
        } catch (error) {
            console.error('Error while adding student to class:', error); // Ghi lại thông tin nếu có lỗi xảy ra
            return res.status(500).json(error);
        }
    },

    getStudentByClass: async(req, res)=>{
        console.log('Class ID:', req.params.classId); // Kiểm tra classId có giá trị hay không
        const classInstance = await req.classInstance.populate('students');
        let limit = req.query.limit;
        if (limit > classInstance.students.length) limit = classInstance.students.length;
        let classMembers = classInstance.students.slice(0, limit);
        res.status(200).json(classMembers);
    },
    
    deleteStudent: async(req, res)=>{
        try {
            const studentId = req.params.studentId; // lấy id từ req.params
            const classInstance = req.classInstance; // lấy classItstance từ req.Instance

            const studentIndex = classInstance.students.indexOf(studentId); // kiểm tra student có tồn tại trong class ??

            if(studentIndex == -1){
                return res.status(404).json('student not found class');
            }
            
            classInstance.students.splice(studentIndex,1); //xóa student
            await classInstance.save(); 

            return res.status(200).json('delete student success');

        } catch (error) {
            res.status(500).json('delete failed');
        }
    }

    
}

module.exports= classContronller;