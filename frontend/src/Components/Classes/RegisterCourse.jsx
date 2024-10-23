import { useEffect, useState } from "react";
import { Table, Modal, Button, Select, Space, Radio, Card } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  registerCourse ,getRegisteredCourses} from "../../api/course";
const { Option } = Select;

const CoursesClass = () => {
    const userAccount = useSelector((state) => state.auth.login?.currentUser);
    const user = useSelector((state) => state.auth.login?.currentUser?.user);
    const initialCoursesClass = useSelector((state) => state.courses.courses?.courses);
    const accessToken = userAccount?.accessToken;
    const registedCourses = useSelector((state) => state.courses.registerCourse?.courses);
    const semester = useSelector((state) =>state.semesters.semesters?.selectedSemester)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedClass, setSelectedClass] = useState(null); // State để lưu lớp học phần đã chọn
    const [courseData, setCourseData] = useState([]); // Mảng lưu các lớp học phần đã chọn

    useEffect(() => {
        if (accessToken) {
          getRegisteredCourses(accessToken,dispatch,semester);
    
        }
      }, [accessToken, dispatch, semester]);

    // Hàm xử lý khi chọn lớp học phần
    const handleRadioChange = (e, record) => {
        setSelectedClass(e.target.value);
        
        const newCourse = {
            subject: record.subject?.subject_code,  // Lấy mã môn học
            course_class_id: record.course_class_id , // Lấy mã lớp học phần
            semester_id:semester
        };

        // Thêm mã môn học và mã lớp học phần vào courseData
        setCourseData(newCourse);
        
        console.log("Selected Course Class:", newCourse.course_class_id); // Ghi log mã lớp học phần
        console.log("Selected Subject Code:", newCourse.subject); // Ghi log mã môn học
        console.log("Current Course Data:", courseData); // Ghi log toàn bộ courseData
    };
    
    const handleRegisterCourse = () => {
        console.log("Course Data:", courseData);
        if(courseData){
            registerCourse(accessToken,dispatch,courseData).then(()=>{
                navigate('/register-courses/subjects')
            })
        }
    };

    const columns = [
        {
            title: 'TT',
            render: (_, __, index) => index + 1,
            width: "20px",
            align: 'center'
        },
        {
            title: 'Loại',
            render: (_, __, index) => "Lý Thuyết",
            width: "20px",
            align: 'center'
        },
        
        {
            title: 'Mã Lớp Học Phần',
            dataIndex: 'course_class_id',
            key: 'course_class_id',
            width: 120,
            align: 'center'
        },
        {
            title: 'Tên Học Phần',
            dataIndex: 'subject',
            key: 'subject_name',
            render: (subject) => subject?.subject_name || "N/A",
            width: 220
        },
        {
            title: 'STC',
            dataIndex: 'subject',
            key: 'credits_number',
            render: (subject) => subject?.credits_number || "N/A",
            width: 20,
            align: 'center'
        },
        {
            title: 'Thứ',
            dataIndex: 'day_of_week',
            key: 'day_of_week',
            align: 'center',
            width: 70,
        },
        {
            title: 'Tiết',
            dataIndex: 'start_period',
            key: 'start_period',
            render: (_, record) => {
                const startPeriod = record.start_period;
                const endPeriod = record.end_period;
                return startPeriod && endPeriod ? `${startPeriod} - ${endPeriod}` : "N/A";
            },
            width: 70,
            align: 'center'
        },
        {
            title: 'Phòng',
            dataIndex: 'class_room',
            key: 'class_room',
            render: (class_room) => class_room?.classroom_name || "N/A",
            width: 70,
            align: 'center'
        },
        {
            title: 'CBGD',
            dataIndex: 'teacher',
            key: 'username',
            render: (teacher) => teacher?.username || "N/A",
        },
        {
            title: 'Còn Lại',
            dataIndex: 'max_student',
            key:'max_student',
            render: (max_student,record) => max_student - record?.studentCount ,
            width: "70px",
            align: 'center'
        },
        {
            title: 'Chọn',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Radio
                        value={record.course_class_id}
                        checked={selectedClass === record.course_class_id}
                        onChange={(e) => handleRadioChange(e, record)}
                    />
                </Space>
            ),
            width: 70,
            align: 'center'
        },
    ];

    const registeredColumns = [
        {
          title: 'TT',
          render: (_, __, index) => index + 1,
          width: "20px",
          align: 'center'
        },{
          title: 'Loại',
          render: (_, __, index) => "Lý Thuyết",
          width: "20px",
          align: 'center'
        },
        {
          title: 'Mã Học phần',
          dataIndex: 'course_class', // Đảm bảo rằng dữ liệu của course_class tồn tại
          key: 'subject_code',
          render: (course_class) => course_class?.subject?.subject_code, // Truy cập mã học phần từ subject
        },
        {
          title: 'Tên Học Phần',
          dataIndex: 'course_class',
          key: 'subject_name',
          width: 250,
          render: (course_class) => course_class?.subject?.subject_name, // Truy cập tên học phần từ subject
        },
        {
          title: 'STC',
          dataIndex: 'course_class',
          key: 'credits_number',
          align: 'center',
          render: (course_class) => course_class?.subject?.credits_number, // Truy cập số tín chỉ từ subject
          width: 70,
        },
      
        {
          title: 'Giảng Viên',
          dataIndex: ['course_class', 'teacher','username'],
          key: 'username',
        },
        {
          title: 'Hành động',
          key: 'action',
          render: (_, record) => (
              <Space size="middle">
                  <Button>Hủy</Button>
              </Space>
          ),
          width: 100,
          align: 'center'
      },
      ];
      
    return (
        <main className="content-container">
            <div className="content-header">
                Đăng Ký Học Phần
            </div>
            <div className="content-body">
          
                <div className='table'>
                    <Card>
                        <div className='title-table'>Đăng Ký Học Phần</div>
                        <Table columns={columns} 
                        dataSource={initialCoursesClass} 
                        rowKey="_id" 
                        
                        pagination={false}
                        />
                    </Card>
                    <div className="btn-container">
                        <>
                            <Button type="primary" onClick={handleRegisterCourse}>Đăng ký</Button>
                        </>
                    </div>

                    <div className="registered-courses">
                        <Card key={registedCourses?._id} style={{ marginBottom: 20 }}>
                        <div className='title-table'> Học Phần Đã Đăng Ký</div>
                        <Table
                            columns={registeredColumns}
                            dataSource={registedCourses} // Dữ liệu từ danh sách đã đăng ký
                            rowKey="_id"
                            bordered
                            pagination={false}
                        />
                        </Card>
                    </div>
                </div>
                
            </div>
           
        </main>
    );
};

export default CoursesClass;
