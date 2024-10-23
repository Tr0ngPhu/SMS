import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Space, Modal, Card, Select } from 'antd';
import { EditOutlined, DeleteOutlined ,AppstoreAddOutlined} from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { getCurriculum, addCurriculum, removeSubjectByCurriculum, addSemesterToCurriculum } from '../../api/curriculum';
import { getFaculty } from '../../api/faculty';
import { getMajorByFacultyId } from '../../api/major';
import { getSubject
  
 } from '../../api/subject';
const { Option } = Select;

const Program = () => {

  const userAccount = useSelector((state) => state.auth.login?.currentUser);
  const initialFaculty = useSelector((state) => state.faculties.faculties?.faculty); 
  const initialMajor = useSelector((state) => state.majors.majors?.majorsByFaculty);
  const initialCurriculum = useSelector((state)=> state.curriculums.curriculums?.curriculums);
  const initialSubject = useSelector((state)=> state.subjects.subjects?.subject)
  const initialSemester = useSelector((state) =>state.semesters.semesters?.allSemester)
  const accessToken = userAccount?.accessToken;

  const dispatch = useDispatch();
  const navigate = useDispatch();
  const [curriculums, setCurriculums] = useState();
  const [faculties, setFaculties] = useState(initialFaculty);
  const [selectedFaculty, setSelectedFaculty] = useState();
  const [selectedMajor, setSelectedMajor] = useState();
  const [semester, setSemester]= useState()
 

  // Cập nhật danh sách khoa
  useEffect(() => {
    if (accessToken) {
      getFaculty(accessToken, dispatch)
        .then(() => {
          setFaculties(initialFaculty);
        });
    }
  }, [accessToken, dispatch]);

  

  // Hàm xử lý khi chọn khoa
  const handleSelectFaculty = (value) => {
    setSelectedFaculty(value);
    getMajorByFacultyId(accessToken, dispatch, value);
  };

  // Hàm xử lý chọn chuyên ngành
  const handleSelectMajor = (value) => {
    setSelectedMajor(value);
    console.log(value);
    if (selectedFaculty) {
      getCurriculum(accessToken, dispatch, selectedFaculty, value);
      setCurriculums(initialCurriculum);
    }
  };

  const [newSemester, setNewSemester] = useState({semester_id:'', major: '', faculty_id: '' });
  const [isModalFacultyVisible, setIsModalFacultyVisible] = useState(false);
  
  const handldAddSemester = ()=>{
    setNewSemester({...newSemester,faculty_id:selectedFaculty, major:selectedMajor})
    console.log(newSemester)
    if(selectedFaculty&& selectedMajor ){
      addSemesterToCurriculum(accessToken,dispatch, newSemester)
      .then(()=>{
          getCurriculum(accessToken, dispatch, selectedFaculty, selectedMajor);
          setCurriculums(initialCurriculum)
          setIsModalFacultyVisible(false)
      });
  }
  }
  const [newSubject, setNewSubject] = useState({subject:'', semester_id:'', major: '', faculty_id: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddSubject = () => {
    console.log(newSubject)
    if(selectedFaculty&& selectedMajor && semester ){
        addCurriculum(accessToken,dispatch, newSubject)
        .then(()=>{
            getCurriculum(accessToken, dispatch, selectedFaculty, selectedMajor);
            setCurriculums(initialCurriculum)
            setIsModalVisible(false)
        });
    }
  };

  // Xử lý khi nhấn nút thêm môn học trong từng học kỳ
  const handleClick = (semester_id) => {
    setSemester(semester_id);
    setNewSubject((prevState) => ({
      ...prevState,
      semester_id: semester_id,
      major: selectedMajor,
      faculty_id: selectedFaculty
    }));
    setIsModalVisible(true);
  };

  useEffect(()=>{
    if(initialCurriculum){
        setCurriculums(initialCurriculum);
    }
  },[initialCurriculum])
   // Lấy danh sách môn học dựa trên khoa đã chọn
   useEffect(() => {
    if (selectedFaculty && accessToken && initialSubject) {
      getSubject(accessToken, dispatch, selectedFaculty)
    }
  }, [selectedFaculty, accessToken, dispatch]);


  const handleRemoveSubject = (curriculumId, subjectId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa chuyên ngành này?',
      onOk() {
          console.log(curriculumId, subjectId);
            removeSubjectByCurriculum(accessToken, dispatch, curriculumId, subjectId).then(() => {
            getCurriculum(accessToken, dispatch, selectedFaculty, selectedMajor);
            setCurriculums(initialCurriculum) 
          });
        
      },  
    });
  };

  const columns = (curriculumId) => [
    {
      title: 'TT',
      render: (_, __, index) => index + 1,
      width: "20px",
      align: 'center' // Căn giữa nội dung cột
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
      width:400
    },
    {
      title: 'Số Tín Chỉ',
      dataIndex: 'credits_number',
      key: 'credits_number',
      align: 'center' // Căn giữa nội dung cột
    },
    {
        title: 'Số Tiết',
        key: 'so_tiet',
        render: (record) => record.credits_number * 10, 
        align: 'center' // Căn giữa nội dung cột
      },
    {
      title: 'Ghi chú',
      width: 200
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} onClick={() => handleRemoveSubject(curriculumId,record._id)} />
        </Space>
      ),
      width: '100px'
    }
  ];

  return (
    <main className="content-container">
      <div className="content-header">Quản Lý Chương Trình</div>

      <div className="content-body">
        <div className='select-container'>
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
            <p className='select-name'>Chuyên Ngành: </p>
            <Select
              style={{ width: 200, marginBottom: 16 }}
              placeholder="Chọn Chuyên Ngành"
              onChange={handleSelectMajor}
            >
              {initialMajor?.map((major) => (
                <Option key={major.major_id} value={major.major_id}>
                  {major.major_name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
              
        <div className='btn-container'>
            <p className='btn-name'>Thêm Học Kì:</p>
            <Button
            icon ={<AppstoreAddOutlined />}
              type="primary"
              onClick={() => setIsModalFacultyVisible(true)}
              style={{ marginBottom: 16 }}
            >
            </Button>
        </div>

        <div className="table">
          {curriculums?.map(curriculum => (
            <Card key={curriculum._id} style={{ marginBottom: 20 }}>
              <div style={{display:'flex' ,justifyContent:'space-between'}}>{curriculum.semester.semester_name}
                <Button 
                    icon ={<AppstoreAddOutlined />}
                    type="primary"
                    onClick={() => handleClick(curriculum.semester.semester_id)}
                    style={{ marginBottom: 16 }}>
                </Button>
              </div>
              <Table
                columns={columns(curriculum._id)}
                dataSource={curriculum.subjects} // Pass individual curriculum subjects here
                rowKey="_id"
                bordered
                pagination={false}
              />
            </Card>
          ))}
        </div>

        <Modal
          title="Thêm môn học"
          open={isModalVisible}
          onOk={handleAddSubject}
          onCancel={() => setIsModalVisible(false)}
        >
         
          <Select
            placeholder="Chọn Môn Học"
            value={newSubject.subject}
            onChange={(value) => setNewSubject({ ...newSubject, subject: value })}
            style={{ width: '100%' }}
          >
            {initialSubject?.map(subject => (
              <Option key={subject._id} value={subject.subject_code}>
                {subject.subject_name}
              </Option>
            ))}
          </Select>
        </Modal>

        <Modal
          title="Học Kì"
          open={isModalFacultyVisible}
          onOk={handldAddSemester}
          onCancel={() => setIsModalFacultyVisible(false)}
        >
         
          <Select
            placeholder="Chọn Học kì"
            value={newSemester.semester}
            onChange={(value) => setNewSemester({ ...newSemester, semester_id: value })}
            style={{ width: '100%' }}
          >
            {initialSemester?.map(semester => (
              <Option key={semester._id} value={semester.semester_id}>
                {semester.semester_name}
              </Option>
            ))}
          </Select>
        </Modal>
      </div>
    </main>
  );
};

export default Program;
