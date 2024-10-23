import React, { useEffect, useState } from 'react';
import { Table, Modal, Form, Input, Button, Space, Popconfirm, Avatar, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addStudentToClass, deleteStudent, getStudentByClass, updateStudent } from '../../api/class';
import moment from 'moment';
import "./student.css";

const StudentList = () => {
    const params = useParams();
    const classId = params.classId;
    const user = useSelector((state) => state.auth.login?.currentUser);
    const studentList = useSelector((state) => state.students.students.allStudent);
    
    const accessToken = user?.accessToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [vnu_id, setVnu_id] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        getStudentByClass(accessToken, dispatch, classId);
    }, [classId, accessToken, dispatch]);

    const handleAddStudent = async () => {
        await addStudentToClass(accessToken, dispatch, classId, vnu_id);
        getStudentByClass(accessToken, dispatch, classId);
        setIsModalVisible(false);
        setVnu_id("");
    };

    const handleDeleteStudent = async (studentId) => {
        await deleteStudent(accessToken, dispatch, classId, studentId);
        getStudentByClass(accessToken, dispatch, classId);
    };

    const handleUpdateStudent = async (values) => {
        await updateStudent(accessToken, dispatch, classId, selectedStudent._id, values);
        getStudentByClass(accessToken, dispatch, classId);
        setIsDetailModalVisible(false);
        setSelectedStudent(null);
        form.resetFields();
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setVnu_id("");
    };

    const showDetailModal = (student) => {
        setSelectedStudent(student);
        form.setFieldsValue({
            vnu_id: student.vnu_id,
            username: student.username,
            gender: student.gender,
            date_of_birth: moment(student.date_of_birth, 'YYYYMMDD'),
            email: student.email,
            phonenumber: student.phonenumber
        });
        setIsDetailModalVisible(true);
    };

    const handleDetailCancel = () => {
        setIsDetailModalVisible(false);
        setSelectedStudent(null);
        form.resetFields();
    };

    const handleRedirect = () => {
        if (selectedStudent?._id) {
            navigate(`/scores/student/${selectedStudent._id}`);
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const columns = [
        { title: 'TT',
            render:(_,record, index)=> index+1,
            border: "1px, solid, #f0f0f0",
            width: "20px"
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'vnu_id',
            key: 'vnu_id',
            width: 150,
            sorter: {
                compare: (a, b) => a.vnu_id - b.vnu_id,
                multiple: 5,
            },
            defaultSortOrder: 'ascend',
            border: "1px, solid, #f0f0f0",

        },
        {
            title: 'Họ và tên',
            dataIndex: 'username',
            key: 'username',
            width: 200,
            ...getColumnSearchProps('username'),
            border: "1px, solid, #f0f0f0",

        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => (text === 'male' ? 'Nam' : 'Nữ'),
            width: 100,
            border: "1px, solid, #f0f0f0",

        },
        {
            title: 'Ngày sinh',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            render: (text) => moment(text, 'YYYYMMDD').format('DD/MM/YYYY'),
            width: 150,
            border: "1px, solid, #f0f0f0",
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />}>
                        <a onClick={() => showDetailModal(record)}>Chi tiết</a>
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        okText="Đồng ý"
                        cancelText="Hủy"
                        onConfirm={() => handleDeleteStudent(record._id)}
                    >
                        <Button icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>
                </Space>
            ),
            width: "100px",
        }
    ];
    
    return (
        <main className="content-container" title="Danh sách sinh viên" >
            <div className="content-header">
                Quản Lý Sinh viên
            </div>
            <div className='content-body'>
                <div className="btn-container">
                    <div className="createClass">
                        <Button type="primary" onClick={showModal}>Thêm sinh viên</Button>
                    </div>
                </div>
                <div className='table'>
                    <div className='title-table'>Danh sách thông tin sinh viên</div>
                    <Table columns={columns} dataSource={studentList} rowKey="_id" bordered />
                </div>
            </div>
            <Modal
                title="Thêm sinh viên"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="addStudentForm"
                    onFinish={handleAddStudent}
                >
                    <Form.Item
                        name="vnu_id"
                        label="Mã sinh viên"
                        rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
                    >
                        <Input value={vnu_id} onChange={(e) => setVnu_id(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm sinh viên
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Chi tiết Sinh viên"
                open={isDetailModalVisible}
                onCancel={handleDetailCancel}
                footer={[
                    <Button key="back" onClick={handleDetailCancel}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Lưu
                    </Button>,
                ]}
                width={500}
            >
                {selectedStudent && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <Avatar
                            size={64}
                            icon={<UserOutlined />}
                            style={{ marginRight: 20 }}
                        />
                        <div>
                            <h2>{selectedStudent.username}</h2>
                            <p>{selectedStudent.vnu_id}</p>
                        </div>
                    </div>
                )}
                <Form
                    form={form}
                    layout="vertical"
                    name="studentDetailForm"
                    onFinish={handleUpdateStudent}
                    initialValues={{
                        gender: selectedStudent?.gender,
                    }}
                >
                    <Form.Item
                        name="vnu_id"
                        label="Mã sinh viên"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Họ và tên"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Giới tính"
                    >
                        <Input />                
                    </Form.Item>
                    <Form.Item
                        name="date_of_birth"
                        label="Ngày sinh"
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phonenumber"
                        label="Số điện thoại"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </main>
    );
};

export default StudentList;