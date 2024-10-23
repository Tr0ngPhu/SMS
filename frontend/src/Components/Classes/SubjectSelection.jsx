import React, { useEffect } from 'react';
import { Table, Button, Space, Card } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getRegistrationSubjectsList, getCourseClass, getRegisteredCourses } from '../../api/course';
import { useNavigate } from "react-router-dom";

const SubjectSelection = () => {

  const userAccount = useSelector((state) => state.auth.login?.currentUser);
  const initialCurriculum = useSelector((state) => state.curriculums.registrationSubject?.subjects);
  const registedCourses = useSelector((state) => state.courses.registerCourse?.courses);
  const selectedSemester = useSelector((state) => state.semesters.semesters?.selectedSemester);
  const accessToken = userAccount?.accessToken;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Cập nhật danh sách học phần đăng ký
  useEffect(() => {
    if (accessToken) {
      getRegistrationSubjectsList(accessToken, dispatch, selectedSemester);
      getRegisteredCourses(accessToken,dispatch,selectedSemester);

    }
  }, [accessToken, dispatch, selectedSemester]);
 

  // Hàm xử lý khi nhấn vào nút "Đăng ký"
  const handleRegister = (subjectCode) => {
    getCourseClass(accessToken, dispatch, subjectCode);
    navigate(`/register-courses/course`);
  };

  // Cột cho bảng danh sách học phần có thể đăng ký
  const columns = [
    {
      title: 'TT',
      render: (_, __, index) => index + 1,
      width: "20px",
      align: 'center'
    },
    {
      title: 'Mã Học phần',
      dataIndex: 'subject_code',
      key: 'subject_code',
    },
    {
      title: 'Tên Học Phần',
      dataIndex: 'subject_name',
      key: 'subject_name',
      width: 400
    },
    {
      title: 'Số Tín Chỉ',
      dataIndex: 'credits_number',
      key: 'credits_number',
      align: 'center'
    },
    {
      title: 'Số Tiết',
      key: 'so_tiet',
      render: (record) => record.credits_number * 10,
      align: 'center'
    },
    {
      title: 'Ghi chú',
      width: 200,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <Button onClick={() => handleRegister(record.subject_code)}>Đăng ký</Button>
        </Space>
      ),
      width: '100px',
    }
  ];

  // Cột cho bảng danh sách học phần đã đăng ký
 // Cột cho bảng danh sách học phần đã đăng ký
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
      <div className="content-header">Đăng Ký Học Phần</div>
      <div className="content-body">
        <div className="table">
          <Card key={initialCurriculum?._id} style={{ marginBottom: 20 }}>
          <div className='title-table'>Danh Sách Môn Học</div>
            <Table
              columns={columns}
              dataSource={initialCurriculum?.subjects} // Đảm bảo rằng dữ liệu là một mảng
              rowKey="_id"
              bordered
              pagination={false}
            />
          </Card>

          {/* Thêm bảng danh sách học phần đã đăng ký */}
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

export default SubjectSelection;
