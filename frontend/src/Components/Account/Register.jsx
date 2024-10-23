import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, DatePicker } from "antd";
import { registerUser } from "../../api/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./register.css";

const { Option } = Select;

const Register = () => {
    const [formData, setFormData] = useState({
        vnu_id: "",
        username: "",
        email: "",
        role: "student",
        phonenumber: "",
        date_of_birth: "",
        email_id: "",
        password: ""
    });

    const [isModalVisible, setIsModalVisible] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleRegister = (values) => {
        const formattedValues = {
            ...values,
            date_of_birth: values.date_of_birth.format("YYYY-MM-DD")
        };
        registerUser(formattedValues, dispatch, navigate);
    };

    const handleFormChange = (changedValues, allValues) => {
        setFormData((prevState) => ({
            ...prevState,
            ...allValues,
            email_id: allValues.vnu_id ? `${allValues.vnu_id}@school.edu.vn` : prevState.email_id
        }));
    };

    return (
        <div className="register-container">
            <Button type="primary" onClick={showModal}>
                Tạo tài khoản
            </Button>
            <Modal
                title="Tạo tài khoản"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleRegister}
                    initialValues={formData}
                    onValuesChange={handleFormChange}
                >
                    <Form.Item
                        label="VNU ID"
                        name="vnu_id"
                        rules={[{ required: true, message: "Nhập VNU ID!" }]}
                    >
                        <Input
                            placeholder="Nhập VNU ID"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: "Nhập tên đăng nhập!" }]}
                    >
                        <Input
                            placeholder="Nhập tên đăng nhập"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Nhập email của bạn!" }]}
                    >
                        <Input
                            type="email"
                            placeholder="Nhập email của bạn"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: "Chọn vai trò!" }]}
                    >
                        <Select>
                            <Option value="student">Sinh viên</Option>
                            <Option value="teacher">Giáo viên</Option>
                            <Option value="admin">Quản trị viên</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phonenumber"
                        rules={[{ required: true, message: "Nhập số điện thoại!" }]}
                    >
                        <Input
                            type="tel"
                            placeholder="Nhập số điện thoại"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ngày sinh"
                        name="date_of_birth"
                        rules={[{ required: true, message: "Nhập ngày sinh!" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item label="Email ID" name="email_id">
                        <Input value={formData.email_id} readOnly />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Nhập mật khẩu!" }]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo tài khoản
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Register;
