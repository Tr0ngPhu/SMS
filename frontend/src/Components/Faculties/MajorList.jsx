  import React, { useEffect, useState } from 'react';
  import { Table, Button, Input, Space, Modal, Card, Select } from 'antd';
  import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
  import { useSelector, useDispatch } from "react-redux";
  import "./Faculty.css";
  import { createMajor, deleteMajor, getMajor } from '../../api/major';

  const { Option } = Select;

  const MajorList = () => {

    const userAccount = useSelector((state) => state.auth.login?.currentUser);
    const initialFaculty = useSelector((state) => state.faculties.faculties?.faculty); 
    const dispatch = useDispatch();
    const accessToken = userAccount?.accessToken;
    const initialMajor = useSelector((state) => state.majors.majors?.majors);
    const [majors, setMajors] = useState([]);
    const [faculties, setFaculties] = useState(initialFaculty);

    // Fetch dữ liệu majors
    useEffect(() => {
      if (accessToken) {
        getMajor(accessToken, dispatch); // Gọi API khi accessToken thay đổi
      }
    }, [accessToken, dispatch]);

    // Cập nhật majors từ Redux store
    useEffect(() => {
      if (initialMajor) {
        // Sắp xếp majors theo facultyName
        const sortedMajors = [...initialMajor].sort((a, b) => a.facultyName.localeCompare(b.facultyName));
        setMajors(sortedMajors);
      }
    }, [initialMajor]);

    const [newMajor, setNewMajor] = useState({ major_id: '', major_name: '', faculty_id: '' });
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddMajor = () => {
      if (newMajor.major_id && newMajor.major_name && newMajor.faculty_id) {
        createMajor(accessToken,dispatch,newMajor).then(()=>{
          getMajor(accessToken,dispatch)
          setIsModalVisible(false);
        })
        
      }
    };

    const handleDeleteMajor = (id) => {
      Modal.confirm({
        title: 'Bạn có chắc chắn muốn xóa chuyên ngành này?',
        onOk() {
          if(id){
            console.log(id)
              deleteMajor(accessToken,dispatch,id).then(()=>{
              getMajor(accessToken,dispatch);
            });
          }
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
        title: 'Mã Ngành',
        dataIndex: 'major_id',
        key: 'major_id',
      },
      {
        title: 'Tên Ngành',
        dataIndex: 'major_name',
        key: 'major_name'
      },
      {
        title: 'Ghi chú',
        width: 200
      },
      {
        title: 'Hành động',
        key: 'action',
        render: ( record) => (
          <Space size="middle">
            <Button icon={<EditOutlined />} />
            <Button icon={<DeleteOutlined />} onClick={() => 
              handleDeleteMajor(record._id)} />
          </Space>
        ),
        width: '100px'
      }
    ];

    return (
      <main className="content-container">
        <div className="content-header">Quản Lý Chuyên Ngành</div>

        <div className="content-body">
          <Button 
            type="primary" 
            onClick={() => setIsModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Thêm Chuyên Ngành
          </Button>

          <div className="table">
            {majors.map(major => (
              <Card key={major._id} style={{ marginBottom: 20 }}>
                <div>{major.facultyName}</div>
                <Table 
                  columns={columns} 
                  dataSource={major.majors} 
                  rowKey="_id" 
                  bordered 
                  pagination={false} 
                />
              </Card>
            ))}
          </div>
          
          <Modal
            title="Thêm Chuyên Ngành Mới"
            open={isModalVisible}
            onOk={handleAddMajor}
            onCancel={() => setIsModalVisible(false)}
          >
            <Input 
              placeholder="ID Ngành" 
              value={newMajor.major_id} 
              onChange={(e) => setNewMajor({ ...newMajor, major_id: e.target.value })}
              style={{ marginBottom: 16 }}
            />
            <Input 
              placeholder="Tên Ngành" 
              value={newMajor.major_name} 
              onChange={(e) => setNewMajor({ ...newMajor, major_name: e.target.value })}
              style={{ marginBottom: 16 }}
            />
            <Select 
              placeholder="Chọn Khoa"
              value={newMajor.facultyName}
              onChange={(value) => setNewMajor({ ...newMajor, faculty_id: value })}
              style={{ width: '100%' , color: '#000'}}
            >
              {faculties.map(faculty => (
                <Option key={faculty._id} value={faculty.faculty_id}> 
                  {faculty.faculty_name}
                </Option>
              ))}
            </Select>
          </Modal>
        </div>
      </main>
    );
  };

  export default MajorList;
