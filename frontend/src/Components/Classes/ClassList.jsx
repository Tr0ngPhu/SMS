import { useEffect, useState } from "react";
import { Table, Modal, Input, Button, Select, Space } from 'antd';
import { EditOutlined, DeleteOutlined, BarsOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteClass, getClass, createClass, } from "../../api/class";
import { getMajorByFacultyId } from "../../api/major"
import {getFaculty} from "../../api/faculty"
import "./classList.css";

const { Option } = Select;

const ClassList = () => {
    const userAccount = useSelector((state) => state.auth.login?.currentUser);
    const user = useSelector((state) => state.auth.login?.currentUser?.user);
    const initialClass = useSelector((state) => state.classes.classes?.classes);
    const initialFaculty = useSelector((state) => state.faculties.faculties?.faculty);
    const initialMajor = useSelector((state) => state.majors.majors?.majorsByFaculty);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = user?.admin; // Assuming user object has a role property
    const accessToken = userAccount?.accessToken;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState();
    const [teacherId, setTeacherId] = useState();
    
    const [newClass, setNewClass] = useState({ class_id: '', class_name: '', faculty_id: '', major: '' });

    useEffect(() => {
        if (accessToken) {
            getFaculty(accessToken, dispatch).then(() => {
                setFaculties(initialFaculty);
            });
        }
        
    }, [accessToken, dispatch]);

    const handleSelectFaculty = (value) => {
        setSelectedFaculty(value);
    };

    useEffect(() => {
        if (selectedFaculty) {
            getClass(accessToken, dispatch, selectedFaculty);
            getMajorByFacultyId(accessToken, dispatch, selectedFaculty);
        }
    }, [selectedFaculty]);

    const handleCreateClass = () => {
        setNewClass({ ...newClass, faculty_id: selectedFaculty });
        if (newClass.class_id && newClass.class_name && newClass.major && selectedFaculty) {
            createClass(accessToken, dispatch, teacherId, newClass).then(() => {
                getClass(accessToken, dispatch, selectedFaculty);
                setIsModalVisible(false);
            });
            console.log(newClass)
        }
    };

    const handelDeleteClass = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa lớp này?',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                await deleteClass(accessToken, dispatch, id);
                getClass(accessToken, dispatch, selectedFaculty);
            },
        });
    };
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'TT',
            render: (_, __, index) => index + 1,
            width: "20px",
            align: 'center'
        },
        {
            title: 'Mã Lớp',
            dataIndex: 'class_id',
            key: 'class_id',
            width: 100,
            align: 'center'
        },
        {
            title: 'Tên Lớp',
            dataIndex: 'class_name',
            key: 'class_name',
            width: 100
        },
        {
            title: 'GV Cố Vấn',
            dataIndex: 'class_teacher',
            key: 'username',
            render: (class_teacher) => class_teacher?.username || "N/A",
            width: 150
        },
        {
            title: 'Số lượng',
            width: 30,
            dataIndex: 'studentCount',
            key: 'studentCount',
            align: 'center'
        },
        {
            title: 'Chuyên Ngành',
            width: 150,
            dataIndex: 'major',
            key: 'major_name',
            render: (major) => major?.major_name || "N/A",
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<BarsOutlined />} onClick={() => navigate(`/student/${record.class_id}`)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handelDeleteClass(record.class_id)} />
                </Space>
            ),
            width: 70,
            align: 'center'
        },
    ];

    return (
        <main className="content-container">
            <div className="content-header">
                Quản Lý Lớp Sinh Viên
            </div>
            <div className="content-body">
                <div className='select-box'>
                    <p className='select-name'>Khoa: </p>
                    <Select
                        style={{ width: 200, marginBottom: 16 }}
                        placeholder="Chọn Khoa"
                        onChange={handleSelectFaculty}
                    >
                        {faculties.map((faculty) => (
                            <Option key={faculty.faculty_id} value={faculty.faculty_id}>
                                {faculty.faculty_name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="btn-container">
                    {admin && (
                        <div className="createClass">
                            <Button type="primary" onClick={showModal}>Thêm lớp học</Button>
                        </div>
                    )}
                </div>
                <div className='table'>
                    <div className='title-table'>Danh sách lớp sinh viên</div>
                    <Table columns={columns} dataSource={initialClass} rowKey="_id" bordered />
                </div>
                <Modal
                    title="Thêm Lớp Học"
                    open={isModalVisible}
                    onOk={handleCreateClass}
                    onCancel={handleCancel}
                >
                    <Input
                        placeholder="Mã lớp"
                        value={newClass.class_id}
                        onChange={(e) => setNewClass({ ...newClass, class_id: e.target.value })}
                        style={{ marginBottom: 16 }}
                    />
                    <Input
                        placeholder="Tên lớp"
                        value={newClass.class_name}
                        onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
                        style={{ marginBottom: 16 }}
                    />
                    <Input
                        placeholder="Mã giảng viên"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    <Select
                        placeholder="Chọn chuyên ngành"
                        value={newClass.major}
                        onChange={(value) => setNewClass({ ...newClass, major: value })}
                        style={{ width: '100%' }}
                    >
                        {initialMajor.map(major => (
                            <Option key={major._id} value={major.major_id}>
                                {major.major_name}
                            </Option>
                        ))}
                    </Select>
                </Modal>
            </div>
        </main>
    );
};

export default ClassList;
