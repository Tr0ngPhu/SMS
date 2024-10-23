import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Table, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { getMyScore } from '../../redux/apiRequest';  // Thay thế với hàm API thực tế của bạn

const { Option } = Select;

const Transcript = () => {
    const userAccount = useSelector((state) => state.auth.login?.currentUser);
    const data = useSelector((state)=> state.scores.scores?.myScore)
    const [semesters, setSemesters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();
    const accessToken = userAccount?.accessToken;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await getMyScore(accessToken, dispatch); // Giả sử hàm này lấy dữ liệu học kỳ và điểm số
            setSemesters(data);
            setIsLoading(false);
        };
        
        if (accessToken) {
            fetchData();
        }
    }, [accessToken, dispatch]);

    const columns = [
        {
            title: 'Tên môn học',
            dataIndex: ['subject', 'subject_name'],
            key: 'subject_name',
            width: 250  
        },
        {
            title: 'Mã môn học',
            dataIndex: ['subject', 'subject_code'],
            key: 'subject_code',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: ['subject', 'credits_number'],
            key: 'credits_number',
        },
        {
            title: 'Điểm số',
            dataIndex: 'score',
            key: 'score',
        },
    ];

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '10px auto', padding: '20px', backgroundColor: '#fff' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Bảng kết quả học tập</h1>

            {isLoading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <div>
                    {semesters?.map(semesterData => (
                        <div key={semesterData.semester?._id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                            <h3 style={{ color: '#333' }}>{semesterData.semester?.semester_name}</h3>
                            <p>Từ: {new Date(semesterData.semester?.start_date).toLocaleDateString()} -
                               Đến: {new Date(semesterData.semester?.end_date).toLocaleDateString()}</p>
                            <Table
                                columns={columns}
                                dataSource={semesterData.scores}
                                rowKey="_id"
                                pagination={false}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Transcript;
