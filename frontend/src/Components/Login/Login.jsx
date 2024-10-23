import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginUser } from "../../api/auth";
import { message } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            email_id: username,
            password: password,
        };

        const response = await loginUser(newUser, dispatch, navigate);
        if (response.success) {
            message.success("Đăng nhập thành công!");
        } else {
            message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form-container">
                    <h1 className="login-title">Đăng nhập</h1>
                    <p className="login-subtitle">Hệ thống Quản lý Sinh viên</p>
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <div>
                                <UserOutlined className="input-icon" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                placeholder="Tên đăng nhập"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <LockOutlined className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="Mật khẩu"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="login-button">Đăng nhập</button>
                    </form>
                    <p className="login-footer">
                       Quên mật khẩu? <Link to="/register">Reset password</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;