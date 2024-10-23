import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import "./Faculty.css";
import { createFaculty, deleteFaculty, getFaculty } from '../../api/faculty';

const FacultyList = () => {
  const userAccount = useSelector((state) => state.auth.login?.currentUser);
  const initialFaculty = useSelector((state) => state.faculties.faculties?.faculty); 
  const dispatch = useDispatch();
  const accessToken = userAccount?.accessToken;

  // Sử dụng useState cho faculties
  const [faculties, setFaculties] = useState([]);
  
  // Fetch dữ liệu khi component được mount
  useEffect(() => {
    if (accessToken) {
       getFaculty(accessToken, dispatch).then(() => {
        setFaculties(initialFaculty);  
      });
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (initialFaculty) {
      setFaculties(initialFaculty);
    }
  }, [initialFaculty]);
  const [newFaculty, setNewFaculty] = useState({ faculty_id: '', faculty_name: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddFaculty = () => {
    if (newFaculty.faculty_id && newFaculty.faculty_name) {
      createFaculty(accessToken, dispatch, newFaculty)
        .then(() => {
          // Cập nhật danh sách khoa sau khi thêm thành công
          getFaculty(accessToken, dispatch).then(() => {
            setIsModalVisible(false);
          });
        });
    }
  };
  
  const handleDeleteFaculty = (_id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa khoa này?',
      onOk() {
        deleteFaculty(accessToken, dispatch, _id)
          .then(() => {
            // Cập nhật danh sách khoa sau khi xóa thành công
            getFaculty(accessToken, dispatch);
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
      title: 'Mã Khoa',
      dataIndex: 'faculty_id',
      key: 'faculty_id',
    },
    {
      title: 'Tên Khoa',
      dataIndex: 'faculty_name',
      key: 'faculty_name',
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
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteFaculty(record._id)} />
        </Space>
      ),
      width: "100px"
    },
  ];

  return (
    <main className="content-container">
      <div className="content-header">Quản Lý Khoa</div>

      <div className="content-body">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Thêm Khoa
        </Button>

        <div className='table'>
          <div className='title-table'>Danh sách khoa</div>
          <Table columns={columns} dataSource={faculties} rowKey="_id" bordered />
        </div>

        <Modal
          title="Thêm Khoa Mới"
          open={isModalVisible}
          onOk={handleAddFaculty}
          onCancel={() => setIsModalVisible(false)}
        >
          <Input 
            placeholder="ID Khoa" 
            value={newFaculty.faculty_id} 
            onChange={(e) => setNewFaculty({ ...newFaculty, faculty_id: e.target.value })}
            style={{ marginBottom: 16 }}
          />
          <Input 
            placeholder="Tên Khoa" 
            value={newFaculty.faculty_name} 
            onChange={(e) => setNewFaculty({ ...newFaculty, faculty_name: e.target.value })}
          />
        </Modal>
      </div>
    </main>
  );
};

export default FacultyList;
