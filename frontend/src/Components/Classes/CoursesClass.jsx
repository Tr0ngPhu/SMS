import { useEffect, useState } from "react";
import { Table, Modal, Input, Button, Select, Space, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, BarsOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {getCourseClass,settingRegisterCourse,createCourse,deleteCourseClass} from "../../api/course";
import { getSubject } from "../../api/subject";
import { getFaculty } from "../../api/faculty";
import { getSemester } from "../../api/semester";
import { setSelectedSemesterSuccess } from "../../redux/semesterSlice";

const { Option } = Select;

const CoursesClass = () => {
    const userAccount = useSelector((state) => state.auth.login?.currentUser);
    const user = useSelector((state) => state.auth.login?.currentUser?.user);
    const initialCoursesClass = useSelector((state) => state.courses.courses?.courses);
    const initialFaculty = useSelector((state) => state.faculties.faculties?.faculty);
    const initialSubject = useSelector((state) => state.subjects.subjects?.subject);
    const initialSemester = useSelector((state) => state.semesters.semesters?.allSemester);
    const semester = useSelector((state) => state.semesters.semesters?.selectedSemester);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = user?.admin;
    const accessToken = userAccount?.accessToken;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'settings'
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState();
    const [selectedSubject, setSelectedSubject] = useState();
    const [newCourseClass, setNewCourseClass] = useState({
        course_class_id: '',
        day_of_week: '',
        class_period: '',
        start_period: '',
        end_period: '',
        classroom: '',
        max_student: '',
        subject: '',
        teacherId: '',
    });
    const [selectedFaculties, setSelectedFaculties] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(semester);

    useEffect(() => {
        if (accessToken) {
            getFaculty(accessToken, dispatch).then(() => {
                setFaculties(initialFaculty);
            });
            getSemester(accessToken, dispatch); 
        }
    }, [accessToken, dispatch]);

    const handleSelectFaculty = (value) => {
        setSelectedFaculty(value);
    };

    const handleSelectSubject = (value) => {
        setSelectedSubject(value);
        getCourseClass(accessToken, dispatch, value);
    };

    useEffect(() => {
        if (selectedFaculty) {
            getSubject(accessToken, dispatch, selectedFaculty);
        }
    }, [selectedFaculty]);

    const handleCreateCourseClass = () => {
        setNewCourseClass({ ...newCourseClass, subject: selectedSubject });
        if (newCourseClass.course_class_id && newCourseClass.day_of_week && newCourseClass.class_period && newCourseClass.start_period && newCourseClass.end_period && newCourseClass.classroom && newCourseClass.subject && newCourseClass.teacherId) {
            createCourse(accessToken, dispatch, newCourseClass).then(() => {
                getCourseClass(accessToken, dispatch, selectedSubject);
                setIsModalVisible(false);
            });
        }
    };

    const handleDeleteCourse = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa lớp học phần này?',
            onOk: async () => {
                await deleteCourseClass(accessToken, dispatch, id);
                getCourseClass(accessToken, dispatch, selectedSubject);
            },
        });
    };

    const showModal = (type) => {
        setModalType(type);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewCourseClass({
            course_class_id: '',
            day_of_week: '',
            class_period: '',
            start_period: '',
            end_period: '',
            classroom: '',
            subject: '',
            teacherId: '',
        }); // Reset form
        setSelectedFaculties([]);
        setSelectedSemester(null);
    };

    const handleFacultyChange = (checkedValues) => {
        setSelectedFaculties(checkedValues);
    };

    const handleSemesterChange = (value) => {
        setSelectedSemester(value); // Cập nhật giá trị local state ngay lập tức
        dispatch(setSelectedSemesterSuccess(value)); // Dispatch cập nhật vào Redux
    };

    // Theo dõi sự thay đổi của selectedSemester từ Redux
    useEffect(() => {
        if (semester) {
            setSelectedSemester(semester); // Cập nhật lại local state khi Redux thay đổi
        }
    }, [semester]);

    const handleSettingsUpdate = () => {
        if (selectedFaculties) {
            settingRegisterCourse(accessToken, dispatch, { faculties: selectedFaculties });
        }
        handleCancel(); // Close modal after update
    };

    const columns = [
        {
            title: 'TT',
            render: (_, __, index) => index + 1,
            width: "20px",
            align: 'center'
        },
        {
            title: 'Học Phần',
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
            width: 250
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
            title: 'SL',
            dataIndex: 'studentCount',
            key: 'studentCount',
            render: (studentCount) => studentCount,
            width: 70,
            align: 'center'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<BarsOutlined onClick={() => navigate(`/course/${record.course_class_id}`)} />} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCourse(record._id)} />
                </Space>
            ),
            width: 70,
            align: 'center'
        },
    ];

    return (
        <main className="content-container">
            <div className="content-header">
                Quản Lý Lớp Học Phần
            </div>
            <div className="content-body">
                <div className="select-container">
                    <div className='select-box'>
                        <p className='select-name'>Khoa: </p>
                        <Select
                            style={{ width: 200, marginBottom: 16 }}
                            placeholder="Chọn Khoa"
                            onChange={handleSelectFaculty}
                        >
                            {faculties?.map((faculty) => (
                                <Option key={faculty.faculty_id} value={faculty.faculty_id}>
                                    {faculty.faculty_name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div className='select-box'>
                        <p className='select-name'>Học Phần: </p>
                        <Select
                            style={{ width: 200, marginBottom: 16 }}
                            placeholder="Chọn Môn Học"
                            onChange={handleSelectSubject}
                        >
                            {initialSubject?.map((subject) => (
                                <Option key={subject.subject_code} value={subject.subject_code}>
                                    {subject.subject_name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="btn-container">
                    {admin === true && (
                        <>
                            <Button type="primary" onClick={() => showModal('create')}>Tạo lớp học phần</Button>
                            <Button type="primary" icon={<SettingOutlined />} onClick={() => showModal('settings')}></Button>
                        </>
                    )}
                </div>
                <div className='table'>
                    <div className='title-table'>Danh sách lớp học phần</div>
                    <Table columns={columns} dataSource={initialCoursesClass} rowKey="_id" bordered />
                </div>

                <Modal
                    title={modalType === 'create' ? "Thêm Lớp Học" : "Cài Đặt Đăng Ký "}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    onOk={modalType === 'create' ? handleCreateCourseClass : handleSettingsUpdate} // Gọi hàm tương ứng

                >
                    {modalType === 'create' ? (
                        <>
                            <Input
                                placeholder="Mã Lớp Học Phần"
                                value={newCourseClass.course_class_id}
                                onChange={(e) => setNewCourseClass({ ...newCourseClass, course_class_id: e.target.value })}
                                style={{ marginBottom: 16 }}
                            />
                            <Select
                                style={{ width: '100%', marginBottom: 16 }}
                                placeholder="Chọn Thứ"
                                onChange={(value) => setNewCourseClass({ ...newCourseClass, day_of_week: value })}
                            >
                                {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"].map((day) => (
                                    <Option key={day} value={day}>{day}</Option>
                                ))}
                            </Select>
                            <Input
                                placeholder="Tiết Học"
                                value={newCourseClass.class_period}
                                onChange={(e) => setNewCourseClass({ ...newCourseClass, class_period: e.target.value })}
                                style={{ marginBottom: 16 }}
                            />
                            <Input
                                placeholder="Tiết Bắt Đầu"
                                value={newCourseClass.start_period}
                                onChange={(e) => setNewCourseClass({ ...newCourseClass, start_period: e.target.value })}
                                style={{ marginBottom: 16 }}
                            />
                            <Input
                                placeholder="Tiết Kết Thúc"
                                value={newCourseClass.end_period}
                                onChange={(e) => setNewCourseClass({ ...newCourseClass, end_period: e.target.value })}
                                style={{ marginBottom: 16 }}
                            />
                            <Input
                                placeholder="Phòng Học"
                                value={newCourseClass.classroom}
                                onChange={(e) => setNewCourseClass({ ...newCourseClass, classroom: e.target.value })}
                                style={{ marginBottom: 16 }}
                            />

                            <Input
                                placeholder="Số Lượng Sinh viên"
                                value={newCourseClass.max_student}
                                onChange={(e) => setNewCourseClass({ ...newCourseClass, max_student: e.target.value })}
                                style={{ marginBottom: 16 }}
                            />

                            <Input
                                placeholder="Giảng Viên"
                                value={newCourseClass.teacherId}
                                onChange={(e) => setNewCourseClass({ ...newCourseClass, teacherId: e.target.value })}
                                style={{ marginBottom: 16 }}
                            />
                        </>
                    ) : (
                        <>
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                value={selectedFaculties}
                                onChange={handleFacultyChange}
                            >
                                {faculties?.map((faculty) => (
                                    <Checkbox key={faculty.faculty_id} value={faculty._id}>
                                        {faculty.faculty_name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                            <Select
                                style={{ width: 200, marginTop: 16 }}
                                placeholder="Chọn Học Kỳ"
                                value={selectedSemester}
                                onChange={handleSemesterChange}
                            >
                                {initialSemester?.map((sem) => (
                                    <Option key={sem.semester_id} value={sem.semester_id}>
                                        {sem.semester_name}
                                    </Option>
                                ))}
                            </Select>
                        </>
                    )}
                </Modal>
            </div>
        </main>
    );
};

export default CoursesClass;
