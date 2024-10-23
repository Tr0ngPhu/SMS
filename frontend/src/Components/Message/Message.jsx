import React from 'react';
import { Alert } from 'antd';

const Message = ({ type, message, onClose }) => {
    return (
        <Alert
            type={type} // Loại thông báo: "success" (thành công) hoặc "error" (lỗi)
            message={message} // Nội dung thông báo
            showIcon // Hiển thị biểu tượng tùy theo loại thông báo
            closable // Có thể đóng thông báo
            onClose={onClose} // Xử lý khi đóng thông báo
            style={{ marginBottom: '10px' }} // Style tùy chỉnh
        />
    );
}

export default Message;
