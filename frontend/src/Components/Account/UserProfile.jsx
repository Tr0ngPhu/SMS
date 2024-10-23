import React, { useState, useEffect } from 'react';
import { Layout, Form, Avatar, Input, DatePicker, Button, Switch, message, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined } from '@ant-design/icons';
import moment from 'moment';
import styled, { createGlobalStyle } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../redux/apiRequest';

const { Header, Content } = Layout;
const { Title } = Typography;

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f0f2f5;
  }
  .ant-input:hover, .ant-input:focus, .ant-input-password:hover, .ant-input-password:focus, .ant-picker:hover, .ant-picker-focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  .ant-form-item-label > label {
    color: #1890ff;
  }
`;

const StyledLayout = styled(Layout)`
  background: transparent;
`;

const StyledHeader = styled(Header)`
  background-image: url("https://user-images.githubusercontent.com/513929/53929982-e5497700-404c-11e9-8393-dece0b196c98.png");
  background-size: cover;
  background-position: center;
  height: 200px;
`;

const StyledContent = styled(Content)`
  padding: 50px 40px 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 800px;
  width: 90%;
  margin: -50px auto 40px;
  position: relative;
`;

const StyledAvatar = styled(Avatar)`
  background-color: #1890ff;
  height: 120px;
  width: 120px;
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 40px !important;
  color: #1890ff;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
`;

const dateFormat = 'DD/MM/YYYY';

const ProfileForm = () => {
  const [form] = Form.useForm();
  const [passwordSwitch, setPasswordSwitch] = useState(false);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const profileData = useSelector((state) => state.users.users?.profile);
  const accountUser = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = accountUser.accessToken;
  const dispatch = useDispatch();

  useEffect(() => {
    getProfile(accessToken, dispatch);
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (profileData) {
      setFormValues(profileData);
    }
  }, [profileData]);

  const translateRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'teacher':
        return 'Cố vấn học tập';
      case 'student':
        return 'Sinh viên';
      default:
        return role;
    }
  };

  const setFormValues = (profileData) => {
    form.setFieldsValue({
      ...profileData,
      role: translateRole(profileData.role),
      date_of_birth: moment(profileData.date_of_birth)
    });
  };

  const handleEditButtonClick = () => {
    setEditMode(true);
  };

  const onChangePassSwitch = () => {
    setPasswordSwitch(!passwordSwitch);
  };

  const handleSubmit = async () => {
    try {
      setSubmitButtonLoading(true);
      const values = await form.validateFields();
      console.log('Submitted values:', values);
      message.success('Thông tin đã được cập nhật thành công!');
      setSubmitButtonLoading(false);
      setEditMode(false);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin.');
      setSubmitButtonLoading(false);
    }
  };

  return (
    <StyledLayout>
      <GlobalStyle />
      <StyledHeader />
      <StyledContent>
        <StyledAvatar
          src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png"
          icon={<UserOutlined />}
        />
        <StyledTitle level={2}>Thông tin cá nhân</StyledTitle>
        <Form
          form={form}
          layout="vertical"
          size="large"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item 
                label="Họ và tên" 
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input prefix={<UserOutlined />} disabled={!editMode} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="VNU ID" name="vnu_id">
                <Input prefix={<IdcardOutlined />} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Vai trò" name="role">
                <Input prefix={<IdcardOutlined />} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Ngày sinh" 
                name="date_of_birth"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker format={dateFormat} style={{ width: '100%' }} disabled={!editMode} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item 
            label="Email" 
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} disabled={!editMode} />
          </Form.Item>
          <Form.Item 
            label="Số điện thoại" 
            name="phonenumber"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="location">
            <Input prefix={<HomeOutlined />} disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Đổi mật khẩu">
            <Switch
              checked={passwordSwitch}
              checkedChildren="Có"
              unCheckedChildren="Không"
              onChange={onChangePassSwitch}
              disabled={!editMode}
            />
          </Form.Item>
          {editMode && passwordSwitch && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  label="Mật khẩu cũ" 
                  name="old_password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Mật khẩu mới" 
                  name="new_password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Form.Item>
            {editMode ? (
              <>
                <StyledButton type="primary" onClick={handleSubmit} loading={submitButtonLoading}>
                  Cập nhật
                </StyledButton>
                <Button onClick={() => { form.resetFields(); setEditMode(false); }}>
                  Hoàn tác
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEditButtonClick}>
                Sửa thông tin
              </Button>
            )}
          </Form.Item>
        </Form>
      </StyledContent>
    </StyledLayout>
  );
};

export default ProfileForm;
