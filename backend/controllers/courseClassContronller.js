const { default: mongoose } = require('mongoose');
const CourseClass = require('../models/CourseClassSchema');
const CourseRegistration = require('../models/CourseRegistrationSchema');
const RegistrationSetting = require('../models/RegistrationSettingSchema')
const Schedule = require('../models/ScheduleSchema');
const ObjectId = mongoose.Types.ObjectId
const CourseClassContronller= {
    createCourseClass: async(req,res)=>{
        try {
            const subjectInstance = req.subjectInstance;
            const teacherInstance = req.teacherInstance;
            const classRoomInstance = req.classRoomInstance;
            
            const existingClass = await CourseClass.findOne({
                class_room: classRoomInstance._id,
                day_of_week: req.body.day_of_week,
                start_period: { $lte: req.body.end_period },  // Kiểm tra khoảng thời gian bắt đầu <= thời gian kết thúc
                end_period: { $gte: req.body.start_period }   // Kiểm tra khoảng thời gian kết thúc >= thời gian bắt đầu
            });
    
            if (existingClass) {
                return res.status(400).json({
                    message: "Lớp học phần bị trùng thứ, tiết và phòng. Vui lòng chọn thời gian hoặc phòng học khác."
                });
            }

            const newCourseClass = new CourseClass({
                course_class_id:req.body.course_class_id,
                day_of_week: req.body.day_of_week,
                class_period:req.body.class_period,
                start_period: req.body.start_period,
                end_period:req.body.end_period,
                start_date:req.body.start_date,
                end_date:req.body.end_date,
                max_student:req.body.max_student,
                class_room: classRoomInstance._id,
                subject: subjectInstance._id,
                teacher: teacherInstance._id,
                students:[]
            });
            

            const saveCourseClass = await newCourseClass.save();
            res.status(200).json(saveCourseClass);
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getCourseClass: async(req, res)=>{
        try {
            const subjectInstance = req.subjectInstance
            const user = req.user 
            let courseClasses ;
                courseClasses = await CourseClass.find({subject: new ObjectId(subjectInstance._id)})
                .populate('class_room').populate('subject').populate('teacher');
             // Thêm số lượng sinh viên vào từng lớp
             const classDataWithStudentCount = courseClasses.map(classItem => ({
                ...classItem.toObject(), // Chuyển đổi tài liệu mongoose sang đối tượng
                studentCount: classItem.students.length 
            }));
            console.log(classDataWithStudentCount);
            res.status(200).json(classDataWithStudentCount);
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    },
    deleteCourseClass: async(req, res )=>{
        const id = req.params.id
        try {
            await CourseClass.findOneAndDelete(id)
            res.status(200).json({message: 'Xóa thành công'})
        } catch (error) {
            res.status(500).json(error)
        }
    },
    
   
    checkRegisterCourse: async(req,res,next)=>{
        try {
            const subjectInstance = req.subjectInstance
            console.log(subjectInstance)
            const courseClasses = await CourseClass.find({subject: subjectInstance._id });
            if(!courseClasses){
                return res.status(404).json({message: 'không tìm thấy lớp học phần'});
            }
            const user = req.user
            if(user.role !== 'student'){
                return res.status(400).json({message: 'người dùng không phải là Sinh viên'})
            }
            // Lấy danh sách các `course_class_id` từ kết quả tìm kiếm
            const courseClassIds = courseClasses.map(cc => cc._id);
             // Kiểm tra xem sinh viên đã đăng ký bất kỳ lớp học phần nào của môn học đó chưa
            const registration = await CourseRegistration.findOne({
                student: user.id,
                course_class: { $in: courseClassIds }
            });
            if (registration) {
                return res.status(400).json({message: 'Học phần này đã được đăng ký'});
            } 
            
            next();
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }        
    },

    registerCourseClass: async(req, res)=>{
        const courseId = req.body.course_class_id
        try {
            const user = req.user
            const instanceSemester =req.instanceSemester
            const courseInstance = await CourseClass.findOne({course_class_id:courseId});
            // Tạo bản ghi đăng ký lớp học phần
            const registration = new CourseRegistration({
                student: user.id,
                semester: instanceSemester._id,
                course_class: new ObjectId(courseInstance._id),
            });
            await registration.save();

            // Cập nhật lịch học của sinh viên
            const schedule = new Schedule({
                user: user.id,
                semester: instanceSemester._id,
                course_class: courseInstance._id,
            });
            await schedule.save();

            // Thêm sinh viên vào mảng students của lớp học phần
            courseInstance.students.push(user.id);
            await courseInstance.save();  // Lưu lại thay đổi

            res.status(200).json({ message: 'Đăng ký lớp học phần thành công' });

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Đăng ký lớp học phần thất bại'});
        }
    },
    cancelCourseClass: async(req, res) => {
        try {
            const courseId = req.params.id;
            const course = await CourseRegistration.findByIdAndDelete(courseId);
           
            const schedule = await Schedule.findOne({
                user: course.student,
                course_class: course.course_class
            });
            
            if (schedule) {
                await Schedule.findByIdAndDelete(schedule._id);
            }
            
            res.status(200).json({ message: 'Hủy học phần thành công' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    setRegistration: async (req, res) => {
        try {
            const instanceFaculties = req.body.faculties;  // Mảng faculties từ request body
    
            // Kiểm tra xem có dữ liệu đúng không
            if (!instanceFaculties) {
                return res.status(400).json({ message: "Faculty or Semester not found" });
            }
    
            const setting = new RegistrationSetting({
                faculties: instanceFaculties.map(facultyId => new ObjectId(facultyId)),  // Chuyển đổi danh sách faculty_id thành ObjectId
                start_date: req.body.start_date,
                end_date: req.body.end_date,
            });
    
            await setting.save();
            res.status(200).json("Cài đặt đăng ký thành công");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    

    checkRigistrationSettting: async(req,res,next)=>{
        try {
            const user = req.user
            const existingSetting = await RegistrationSetting.findOne({ faculties: { $in: [user.faculty] } });
            if(!existingSetting){
                res.status(403).json('Chưa đến thời hạn đăng ký. Vui lòng quay lại sau')
            }
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRegisteredCourses: async(req,res) =>{
        try {
            const user = req.user
            const instanceSemester = req.instanceSemester
            const courses = await CourseRegistration.find({
                student: user.id,
                semester: instanceSemester._id
            }).populate({
                path: 'course_class',
                populate: [
                    { path: 'subject' },
                    { path: 'teacher' }
                ]
            });
            res.status(200).json(courses);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    },

    getSchedule: async(req,res) =>{
        try {
            const user = req.user
            const instanceSemester = req.instanceSemester
            const schedule = await Schedule.find({
                user: user.id,
                semester: instanceSemester._id
            }).populate({
                path: 'course_class',
                populate: [
                    { path: 'subject' },
                    { path: 'teacher' },
                    {path :'class_room'}
                ]
            });
            console.log(schedule)
            res.status(200).json(schedule);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    },
    findCourseClassById: async(req,res, next) =>{
        const {courseClassId} = req.params
        try {
            const courseClassInstance = await CourseClass.findOne({course_class_id:courseClassId});

            if(!courseClassInstance){
                return res.status(404).json({message: 'Không tìm thấy lớp học phần'});
            }
            req.courseClassInstance = courseClassInstance
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getStudentByCourseClass: async(req, res)=>{
        const courseClassInstance = await req.courseClassInstance.populate('students');
        let limit = req.query.limit;
        if (limit > courseClassInstance.students.length) limit = courseClassInstance.students.length;
        let classMembers = courseClassInstance.students.slice(0, limit);
        res.status(200).json(classMembers);
    },
    
}

module.exports= CourseClassContronller