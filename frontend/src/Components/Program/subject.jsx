import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import {  getSubject, createSubject, deleteSubject } from '../../api/subject';
import { getFaculty } from '../../api/faculty';

const { Option } = Select;

const SubjectList = () => {
  const userAccount = useSelector((state) => state.auth.login?.currentUser);
  const initialFaculty = useSelector((state) => state.faculties.faculties?.faculty);
  const initialSubject = useSelector((state)=> state.subjects.subjects?.subject);
  const dispatch = useDispatch();
  const accessToken = userAccount?.accessToken;

  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState();
  const [subjects, setSubjects] = useState(initialSubject);

  // Cập nhật danh sách khoa
  useEffect(() => {
    if (accessToken) {
      getFaculty(accessToken, dispatch)
        .then(() => {
          setFaculties(initialFaculty);
        });
    }
  }, [accessToken, dispatch]);
  useEffect(() => {
    if (accessToken) {
      getFaculty(accessToken, dispatch)
        .then(() => {
          setFaculties(initialFaculty);
        });
    }
  }, [accessToken, dispatch]);

  // Lấy danh sách môn học dựa trên khoa đã chọn
  useEffect(() => {
    if (selectedFaculty && accessToken && initialSubject) {
      getSubject(accessToken, dispatch, selectedFaculty)
        .then(() => setSubjects(initialSubject));
    }
  }, [selectedFaculty, accessToken, dispatch]);

  
  useEffect(() => {
    setNewSubject((prev) => ({ ...prev, faculty_id: selectedFaculty }));
  }, [selectedFaculty]);

  // Hàm xử lý khi chọn khoa
  const handleSelectFaculty = (value) => {
    setSelectedFaculty(value);
  };

  // State của môn học mới
  const [newSubject, setNewSubject] = useState({ subject_code: '', subject_name: '', credits_number: '', faculty_id: null });
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm xử lý khi thêm môn học mới
  const handleAddSubject = () => {
    if (newSubject.subject_code && newSubject.subject_name && newSubject.credits_number && newSubject.faculty_id) {
      createSubject(accessToken, dispatch, newSubject)
        .then(() => {
          setIsModalVisible(false);
          // Lấy lại danh sách môn học sau khi thêm thành công
          getSubject(accessToken, dispatch, selectedFaculty);
        });
    }
  };

  const handleDeleteSubject = (_id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa khoa này?',
      onOk() {
        deleteSubject(accessToken, dispatch, _id)
          .then(() => {
            getSubject(accessToken, dispatch,selectedFaculty);
          });
      },
    });
  };

  const columns = [
    {
      title: 'TT',
      render: (_, __, index) => index + 1,
      width: "20px"
    },
    {
      title: 'Mã Môn Học',
      dataIndex: 'subject_code',
      key: 'subject_code',
    },
    {
      title: 'Tên Môn Học',
      dataIndex: 'subject_name',
      key: 'subject_name',
      width: 400
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'credits_number',
      key: 'credits_number',
      width: 100
    },
    {
      title: 'Ghi chú',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteSubject(record._id)} />
        </Space>
      ),
      width: "100px"
    },
  ];

  return (
    <main className="content-container">
      <div className="content-header">Quản Lý Môn Học</div>

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

        <Button 
          type="primary" 
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Thêm môn học
        </Button>

        <div className='table'>
          <div className='title-table'>Danh sách môn học</div>
          <Table columns={columns} dataSource={initialSubject} rowKey="_id" bordered />
        </div>

        <Modal
          title="Thêm Môn Học Mới"
          open={isModalVisible}
          onOk={handleAddSubject}
          onCancel={() => setIsModalVisible(false)}
        >
          <Input 
            placeholder="Mã Môn Học" 
            value={newSubject.subject_code} 
            onChange={(e) => setNewSubject({ ...newSubject, subject_code: e.target.value })}
            style={{ marginBottom: 16 }}
          />
          <Input 
            placeholder="Tên Môn Học" 
            value={newSubject.subject_name} 
            onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
            style={{ marginBottom: 16 }}
          />
          <InputNumber 
            placeholder="Số tín chỉ" 
            min={0}  // Giới hạn nhỏ nhất là 0
            value={newSubject.credits_number} 
            onChange={(value) => setNewSubject({ ...newSubject, credits_number: value })} 
            style={{ width: '100%', marginBottom: 16 }}
          />
        </Modal>
      </div>
    </main>
  );
};

export default SubjectList;
