import{ React } from 'react';
import {  useNavigate } from "react-router-dom";
import { Menu } from 'antd';
import {ReconciliationOutlined,
  HomeOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  BankOutlined,
  DashboardOutlined,
  NotificationOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import './leftMenu.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../api/auth';
import { createAxios } from '../../createInstance';
import { logOutSuccess } from '../../redux/authSlice';


const MenuComponent = ({ onToggle }) => {
  const userAccount = useSelector((state) => state.auth.login?.currentUser);
  const user = useSelector((state) => state.auth.login.currentUser?.user);
  const accessToken = userAccount?.accessToken;
  const id = user?._id;
  const role = user?.role; 
  const selectedClass = useSelector((state) => state.classes.classes?.selectedClass);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(userAccount, dispatch, logOutSuccess);

 
  const handleLogout = () => {
    logout(dispatch, id, navigate, accessToken, axiosJWT);
  };

  const adminItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: 'newfeed',
      icon: <ReconciliationOutlined />,
      label: 'Bảng tin',
      children: [
        {
          key: '/newfeed',
          label: 'Quản lý bảng tin',
        }
      ],
    },
    {
      key: 'class',
      icon: <TeamOutlined />,
      label: 'Lớp học và sinh viên',
      children: [
        {
          key: '/class',
          label: 'Thông tin',
        },
        // {
        //   key: '/courses',
        //   label: 'Quản lý học phần',
        // },
      ],
    },
    // {
    //   key: 'education',
    //   icon: <BankOutlined />,
    //   label: 'Quản lý đào tạo',
    //   children: [
    //     {
    //       key: '/faculty',
    //       label: 'Khoa',
    //     },
    //     {
    //       key: 'major',
    //       label: 'Ngành học',
    //     },
    //     {
    //       key: '/program',
    //       label: 'Chương trình đào tạo',
    //     },
    //   ],
    // },
    // {
    //   key: 'dashboard',
    //   icon: <DashboardOutlined />,
    //   label: 'Dashboard',
    //   children: [
    //     {
    //       key: '/subject',
    //       label: 'Môn Học',
    //     },
    //     {
    //       key: 'classroom',
    //       label: 'Phòng Học',
    //     },
    //     {
    //       key: 'semester',
    //       label: 'Học kì',
    //     },
    //   ],
    // },
   
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Tài khoản',
      children: [
        // {
        //   key: '/account',
        //   label: 'Quản lý tài khoản',
        // },
        // {
        //   key: '/profile',
        //   label: 'Hồ sơ cá nhân',
        // },
        {
          key: '/logout',
          label: 'Đăng xuất',
        },
      ],
    },
  ];
  
  const teacherItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: 'class',
      icon: <TeamOutlined />,
      label: 'Lớp học',
      children: [
        {
          key: '/class',
          label: 'Quản lý lớp sinh viên',
        },
        {
          key: '/courses',
          label: 'Quản lý lớp học phần',
        },
      ],
    },
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Tài khoản',
      children: [
        {
          key: '/profile',
          label: 'Hồ sơ cá nhân',
        },
        {
          key: '/logout',
          label: 'Đăng xuất',
        },
      ],
    },
  ];
  
  const studentItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '',
      icon: <NotificationOutlined />,
      label: 'Thông Báo',
    },
    {
      key: '/schedule',
      icon: <CalendarOutlined />,
      label: 'Lịch Học',
    },
    {
      key: '/register-courses/subjects',
      icon: <BookOutlined />,
      label: 'Đăng ký học phần',
    },
    {
      key: 'scores',
      icon: <BarChartOutlined />,
      label: 'Kết quả Học Tập',
      children: [
        {
          key: `/scores/${selectedClass?.class_id}`,
          label: 'Điểm của tôi',
        },
      ],
    },
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Tài khoản',
      children: [
        // {
        //   key: '/profile',
        //   label: 'Hồ sơ cá nhân',
        // },
        {
          key: '/logout',
          label: 'Đăng xuất',
        },
      ],
    },
  ];
  
  

    // Chọn menu dựa trên vai trò của người dùng
    let items = [];
    if (role === 'admin') {
      items = adminItems;
    } else if (role === 'teacher') {
      items = teacherItems;
    } else if (role === 'student') {
      items = studentItems;
    }
  
    const onClick = (e) => {
      if (e.key === '/logout') {
        handleLogout();
      } else {
        navigate(e.key);
      }
    };
    
    return (
      <div className={`sidebar`}>
        <div className="content-header">Chức Năng</div>
        <Menu
          onClick={onClick}
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light"
          items={items}
        />
      </div>
    );
  };


export default MenuComponent;


