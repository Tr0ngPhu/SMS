import React, { useEffect, useState } from 'react';
import { Table, Card, Select } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getSchedule } from '../../api/course';
const { Option } = Select;

const Schedule = () => {

  const userAccount = useSelector((state) => state.auth.login?.currentUser);
  const initalSchedule = useSelector((state)=> state.courses.schedule)
  const initialSemester =useSelector((state)=> state.semesters.semesters?.allSemester)
  const selectedSemester = useSelector((state) => state.semesters.semesters?.selectedSemester);
  const accessToken = userAccount?.accessToken;
  const [semester, setSemester] = useState(selectedSemester)
  const dispatch = useDispatch();

  // Cập nhật danh sách học phần đăng ký
  useEffect(() => {
    if (accessToken) {
      getSchedule(accessToken,dispatch,semester);
      console.log(semester)
    }
  }, [accessToken, dispatch, semester]);
  
  const handleSelectedSemester = (semesterId)=>{
    setSemester(semesterId);
  }
  

const Columns = [
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
    dataIndex: ['course_class','course_class_id'], // Đảm bảo rằng dữ liệu của course_class tồn tại
    key: 'course_class_id',
    align: 'center'

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
      title: 'Thứ',
      dataIndex: ['course_class','day_of_week'],
      key: 'day_of_week',
      align: 'center',
      width: 70,
  },
  {
    title: 'Tiết',
    dataIndex: ['course_class','start_period'],
    key: 'start_period',
    render: (start_period, record) => {
        const endPeriod = record.course_class.end_period; // Truy cập end_period từ course_class
        return start_period && endPeriod ? `${start_period} - ${endPeriod}` : "N/A";
    },
    width: 70,
    align: 'center'
  },
  {
      title: 'Phòng',
      dataIndex: ['course_class','class_room'],
      key: 'classroom_name',
      render: (class_room) => class_room?.classroom_name || "N/A",
      width: 70,
      align: 'center'
  },
  {
    title: 'Giảng Viên',
    dataIndex: ['course_class', 'teacher','username'],
    key: 'username',
  },
  
];


  return (
    <main className="content-container">
      <div className="content-header">Thời Khóa Biểu    </div>
      <div className="content-body">
      <div className='select-container'>
          <div className='select-box'>
            <p className='select-name'>Năm Học: </p>
            <Select
              style={{ width: 200, marginBottom: 16 }}
              placeholder="Chọn Năm Học"
            >
              {/* {faculties?.map((faculty) => (
                <Option key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.faculty_name}
                </Option>
              ))} */}
            </Select>
          </div>
          <div className='select-box'>
            <p className='select-name'>Học kì: </p>
            <Select
              style={{ width: 200, marginBottom: 16 }}
              placeholder="Chọn Học kì"
              onChange={handleSelectedSemester}
            >
              {initialSemester?.map((semester) => (
                <Option key={semester.semester_id} value={semester.semester_id}>
                  {semester.semester_name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
              
        <div className="table">
          {/* Thêm bảng danh sách học phần đã đăng ký */}
          <div className="schedule-courses">
            <Card key={initalSchedule?._id} style={{ marginBottom: 20 }}>
            <div className='title-table'> Thời Khóa Biểu</div>
            <Table
                columns={Columns}
                dataSource={initalSchedule} // Dữ liệu từ danh sách đã đăng ký
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

export default Schedule;
