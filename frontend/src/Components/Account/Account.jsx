// import React, { useState, useEffect } from 'react';
// import { Table, Input, Button, Space, Modal, Form, Select, DatePicker } from 'antd';
// import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { getAcccounts, registerUser } from "../../api/auth"; // Chỉnh đường dẫn này nếu cần
// import { useDispatch, useSelector } from "react-redux";
// import './register.css'; // Đảm bảo bạn có CSS cho phần đăng ký

// const { Option } = Select;

// function AdminAccountManagement() {
//   const accountsData = useSelector((state) => state.auth.accounts?.account)
//   const userAccount = useSelector((state) => state.auth.login.currentUser);
//   const [accounts, setAccounts] = useState(accountsData);
//   const [searchedColumn, setSearchedColumn] = useState('');
//   const [searchText, setSearchText] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     vnu_id: "",
//     username: "",
//     email: "",
//     role: "student",
//     phonenumber: "",
//     date_of_birth: "",
//     email_id: "",
//     password: ""
//   });

//   const dispatch = useDispatch();
//   const accessToken = userAccount.accessToken

//   useEffect(() => {
//     async function fetchData() {
//       const data = await getAcccounts(accessToken, dispatch);
//       setAccounts(data);
//       console.log(accountsData)
//     }

//     fetchData();
//   }, [accessToken, dispatch]);

//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//       <div style={{ padding: 8 }}>
//         <Input
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{ width: 188, marginBottom: 8, display: 'block' }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Tìm kiếm
//           </Button>
//           <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
//             Đặt lại
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
//     onFilter: (value, record) => {
//       if (dataIndex.includes('.')) {
//         const [parentKey, childKey] = dataIndex.split('.');
//         return record[parentKey][childKey]
//           .toString()
//           .toLowerCase()
//           .includes(value.toLowerCase());
//       }
//       return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <span style={{ fontWeight: 'bold' }}>{text}</span>
//       ) : (
//         text
//       ),
//   });

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText('');
//   };

//   const columns = [
//     {
//       title: 'Tên người dùng',
//       dataIndex: ['user', 'username'],
//       key: 'username',
//       ...getColumnSearchProps('user.username'),
//     },  
//     {
//       title: 'Email',
//       dataIndex: 'email_id',
//       key: 'email_id',
//       ...getColumnSearchProps('email_id'),
//     },
//     {
//       title: 'Vai trò',
//       dataIndex: ['user', 'role'],
//       key: 'role',
//       filters: [
//         { text: 'Admin', value: 'admin' },
//         { text: 'Teacher', value: 'teacher' },
//         { text: 'Student', value: 'student' },
//       ],
//       onFilter: (value, record) => record.user.role === value,
//     },
//     {
//       title: 'Hành động',
//       key: 'action',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button type="primary" icon={<EditOutlined />}>Chi tiết</Button>
//           <Button danger icon={<DeleteOutlined />}>Xóa</Button>
//         </Space>
//       ),
//     },
//   ];

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const handleRegister = (values) => {
//     const formattedValues = {
//       ...values,
//       date_of_birth: values.date_of_birth.format("YYYY-MM-DD"),
//       email_id: `${values.vnu_id}@school.edu.vn`
//     };
//     registerUser(formattedValues, dispatch);
//     setIsModalVisible(false)
//   };

//   const handleFormChange = (changedValues, allValues) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       ...allValues,
//       email_id: allValues.vnu_id ? `${allValues.vnu_id}@school.edu.vn` : prevState.email_id
//     }));
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Quản lý Tài khoản</h1>
//       <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
//         Tạo tài khoản
//       </Button>
//       <Table 
//         columns={columns} 
//         dataSource={accountsData}
//         rowKey={(record) => record._id}
//       />
//       <Modal
//         title="Tạo tài khoản"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <Form
//           layout="vertical"
//           onFinish={handleRegister}
//           onValuesChange={handleFormChange}
//         >
//           <Form.Item
//             name="vnu_id"
//             label="Mã VNU ID"
//             rules={[{ required: true, message: 'Vui lòng nhập Mã VNU ID' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="username"
//             label="Tên người dùng"
//             rules={[{ required: true, message: 'Vui lòng nhập Tên người dùng' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[{ required: true, message: 'Vui lòng nhập Email' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="role"
//             label="Vai trò"
//             rules={[{ required: true, message: 'Vui lòng chọn Vai trò' }]}
//           >
//             <Select>
//               <Option value="student">Student</Option>
//               <Option value="teacher">Teacher</Option>
//               <Option value="admin">Admin</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="phonenumber"
//             label="Số điện thoại"
//             rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại' }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="date_of_birth"
//             label="Ngày sinh"
//             rules={[{ required: true, message: 'Vui lòng chọn Ngày sinh' }]}
//           >
//             <DatePicker />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             label="Mật khẩu"
//             rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu' }]}
//           >
//             <Input.Password />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Tạo tài khoản
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// export default AdminAccountManagement;