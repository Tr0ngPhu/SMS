// import React, { useEffect, useState } from "react";
// import { Table, Select, Button, Space, Modal, Form, Input, Card } from 'antd';
// import { EditOutlined } from '@ant-design/icons';
// import { useSelector, useDispatch } from "react-redux";
// import { addScore, getScoreClass, getSubjectBySemesterId } from "../../redux/apiRequest";
// import { message } from "antd";
// import "./score.css";

// const { Option } = Select;

// const ScoreTable = () => {
//     const userAccount = useSelector((state) => state.auth.login?.currentUser);
//     const allScore = useSelector((state) => state.scores.scores?.allScore);
//     const selectedClass = useSelector((state) => state.classes.classes?.selectedClass);
//     const allSubject = useSelector((state) => state.subjects.subjectsBySemesterId?.subject.subjects);
//     const allSemester = useSelector((state) => state.semesters.semesters?.allSemester);
//     const dispatch = useDispatch();
//     const accessToken = userAccount?.accessToken;

//     const [scoreData, setScoreData] = useState(allScore);
//     const [selectedClassId, setSelectedClassId] = useState('');
//     const [selectedSubject, setSelectedSubject] = useState(null); // Sử dụng null thay vì undefined
//     const [selectedSemester, setSelectedSemester] = useState(null); // Sử dụng null thay vì undefined
//     const [modalVisible, setModalVisible] = useState(false);
//     const [editingStudent, setEditingStudent] = useState(null); // State để lưu thông tin sinh viên đang chỉnh sửa điểm

//     const [form] = Form.useForm();

//     const handleSubjectChange = (value) => {
//         setSelectedSubject(value);
//     };

//     const handleSemesterChange = async (value) => {
//         setSelectedSemester(value);
//         setSelectedSubject(null); // Đặt lại môn học về null khi thay đổi học kỳ
//         await getSubjectBySemesterId(accessToken, dispatch, value);
//     };

//     const params = {
//         semester_id: selectedSemester,
//         subject_code: selectedSubject
//     };

//     const handleFilter = () => {
//         if (accessToken && selectedClass && selectedSubject && selectedSemester) {
//             getScoreClass(accessToken, dispatch, selectedClass.class_id, params);
//         }
//     };

//     const handleEdit = (record) => {
//         console.log("Edit record: ", record);
//     };

//     const handleOpenModal = (record) => {
//         setEditingStudent(record); // Cập nhật thông tin sinh viên đang chỉnh sửa
//         setModalVisible(true); // Mở modal
//         // Điền thông tin của sinh viên vào form
//         form.setFieldsValue({
//             score: record.scores && record.scores.length > 0 ? record.scores[0].score : null,
//         });
//     };

//     const handleModalCancel = () => {
//         setModalVisible(false);
//         form.resetFields();
//     };

//     const handleModalSubmit = async (values) => {
//         if (editingStudent) {
//             const dataToSubmit = {
//                 vnu_id: editingStudent.vnu_id,
//                 subject_code: selectedSubject,
//                 score: values.score,
//                 semester_id: selectedSemester,
//             };
//             const response = await addScore(accessToken, dispatch, dataToSubmit);
//             if (response.success) {
//                 message.success("Nhập điểm thành công!!");
//             }
//         }
//         getScoreClass(accessToken, dispatch, selectedClass.class_id, params);
//         setModalVisible(false);
//     };

//     useEffect(() => {
//         if (scoreData) {
//             setScoreData(scoreData);
//         }
//     }, [scoreData]);

//     const columns = [
//         {
//             title: 'Mã sinh viên',
//             dataIndex: 'vnu_id',
//             key: 'vnu_id',
//             width: 150,
//         },
//         {
//             title: 'Họ tên',
//             dataIndex: 'username',
//             key: 'username',
//             width: 200,
//         },
//         {
//             title: 'Điểm',
//             dataIndex: 'scores',
//             key: 'score',
//             render: (scores) => scores && scores.length > 0 ? scores[0].score : 'Chưa có điểm',
//             width: 100,
//         },
//         {
//             title: 'Thao tác',
//             key: 'actions',
//             render: (text, record) => (
//                 <Space size="middle">
//                     <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>Sửa</Button>
//                     <Button type="link" onClick={() => handleOpenModal(record)}>Nhập</Button>
//                 </Space>
//             ),
//             width: 150,
//         }
//     ];

//     return (
//         <Card className="container" title="Bảng điểm sinh viên" style={{ margin: '60px' }}>
//             <div className="content" style={{ marginBottom: 20 }}>
//                 <Space>
//                     <Select
//                         style={{ width: 200 }}
//                         placeholder="Chọn học kỳ"
//                         onChange={handleSemesterChange}
//                         value={selectedSemester}
//                     >
//                         {Array.isArray(allSemester) && allSemester.map((semester) => (
//                             <Option key={semester._id} value={semester.semester_id}>{semester.semester_name}</Option>
//                         ))}
//                     </Select>
//                     <Select
//                         style={{ width: 200 }}
//                         placeholder="Chọn môn học"
//                         onChange={handleSubjectChange}
//                         value={selectedSubject}
//                     >
//                         {Array.isArray(allSubject) && allSubject.map((subjectData) => (
//                             <Option key={subjectData._id} value={subjectData.subject_code}>
//                                 {subjectData.subject_name}
//                             </Option>
//                         ))}
//                     </Select>
//                     <Button type="primary" style={{ margin: 0 }} onClick={handleFilter}>Lọc</Button>
//                 </Space>
//             </div>
//             <Table
//                 dataSource={allScore}
//                 columns={columns}
//                 rowKey={(record) => record._id}
//                 pagination={{ pageSize: 10 }}
//                 scroll={{ x: 600 }}
//             />

//             {/* Modal form */}
//             <Modal
//                 title="Nhập điểm cho sinh viên"
//                 visible={modalVisible}
//                 onCancel={handleModalCancel}
//                 footer={[
//                     <Button key="cancel" onClick={handleModalCancel}>
//                         Hủy
//                     </Button>,
//                     <Button key="submit" type="primary" onClick={() => form.submit()}>
//                         Lưu
//                     </Button>,
//                 ]}
//             >
//                 <Form form={form} onFinish={handleModalSubmit}>
//                     <Form.Item
//                         name="score"
//                         label="Điểm"
//                         rules={[{ required: true, message: 'Vui lòng nhập điểm!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </Card>
//     );
// };

// export default ScoreTable;
