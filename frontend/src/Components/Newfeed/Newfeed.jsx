import React, { useState } from 'react';
import { Form, Input, Button, Card, Table, Space, Modal, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, PushpinOutlined } from '@ant-design/icons';
import moment from 'moment'; // Import moment để định dạng ngày

// Function to get initial news data from localStorage
const getInitialNews = () => {
    const storedNews = localStorage.getItem('newFeed');
    if (storedNews) {
        return JSON.parse(storedNews);
    }
    return [
        {
            id: 1,
            title: 'Thông báo về tuần sinh hoạt công dân',
            date: '2023-10-23', // Bạn có thể thay đổi ngày này nếu cần
            description: `Thông báo đến toàn thể sinh viên khoa Công nghệ thông tin về tuần Sinh hoạt công dân vào ngày thứ 2, thứ 4 và thứ 6.\n
            Thứ 2: 14:30 đến 16h\n
            Thứ 4: 14:30 đến 16h\n
            Thứ 6: 14:30 đến 16h`,
            isPinned: false,
        },
        // Bạn có thể thêm các thông báo mẫu khác ở đây
    ];
};

const { TextArea } = Input;

const Newfeed = () => {
    const [news, setNews] = useState(getInitialNews());
    const [form] = Form.useForm();
    const [editingNews, setEditingNews] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Function to save news data to localStorage
    const saveNewsToLocalStorage = (updatedNews) => {
        localStorage.setItem('newFeed', JSON.stringify(updatedNews));
    };

    const handleSubmit = (values) => {
        if (editingNews) {
            const updatedNews = news.map(item =>
                item.id === editingNews.id
                    ? { ...item, ...values, date: values.date.format('YYYY-MM-DD') } // Format lại date
                    : item
            );
            setNews(updatedNews);
            saveNewsToLocalStorage(updatedNews);
        } else {
            const newItem = {
                id: Date.now(),
                ...values,
                date: values.date.format('YYYY-MM-DD'), // Format lại date
                isPinned: false
            };
            const updatedNews = [...news, newItem];
            setNews(updatedNews);
            saveNewsToLocalStorage(updatedNews);
        }
        form.resetFields();
        setEditingNews(null);
        setIsModalVisible(false);
    };

    const handleDelete = (id) => {
        const updatedNews = news.filter(item => item.id !== id);
        setNews(updatedNews);
        saveNewsToLocalStorage(updatedNews);
    };

    const handleEdit = (record) => {
        setEditingNews(record);
        form.setFieldsValue({
            ...record,
            date: moment(record.date) // Sử dụng moment để định dạng lại date
        });
        setIsModalVisible(true);
    };

    const handlePin = (id) => {
        const updatedNews = news.map(item =>
            item.id === id ? { ...item, isPinned: !item.isPinned } : item
        );
        setNews(updatedNews);
        saveNewsToLocalStorage(updatedNews);
    };

    const filteredNews = news
        .filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()))
        .sort((a, b) => b.isPinned - a.isPinned);

    return (
        <div className="news-feed-container">
            <Card title="Quản lý bảng tin">
                <Input.Search
                    placeholder="Tìm kiếm theo tiêu đề"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: 16 }}
                />

                <Button
                    type="primary"
                    onClick={() => {
                        setEditingNews(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                    style={{ marginBottom: 16 }}
                >
                    Thêm bảng tin mới
                </Button>

                <Table
                    columns={[
                        {
                            title: 'Tiêu đề',
                            dataIndex: 'title',
                            key: 'title',
                        },
                        {
                            title: 'Ngày',
                            dataIndex: 'date',
                            key: 'date',
                        },
                        {
                            title: 'Mô tả',
                            dataIndex: 'description',
                            key: 'description',
                            render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>, // Giữ định dạng dòng
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            render: (_, record) => (
                                <Space size="middle">
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(record)}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(record.id)}
                                    >
                                        Xóa
                                    </Button>
                                    <Button
                                        type={record.isPinned ? "default" : "dashed"}
                                        icon={<PushpinOutlined />}
                                        onClick={() => handlePin(record.id)}
                                    >
                                        {record.isPinned ? 'Bỏ ghim' : 'Ghim'}
                                    </Button>
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={filteredNews}
                    rowKey="id"
                />

                <Modal
                    title={editingNews ? "Sửa bảng tin" : "Thêm bảng tin mới"}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="date"
                            label="Ngày"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {editingNews ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)} style={{ marginLeft: 8 }}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default Newfeed;
