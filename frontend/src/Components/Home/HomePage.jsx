import React, { useEffect } from "react";
import "./home.css";
import { getAllUser } from "../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import pic1 from '../../assets/pic1.jpg';
import pic2 from '../../assets/pic2.jpg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login.currentUser?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.accessToken) {
      getAllUser(user?.accessToken, dispatch);
    }
  }, [user, dispatch, navigate]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    adaptiveHeight: true,
    centerMode: true,
    centerPadding: '0px',
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Chào mừng đến với ứng dụng quản lý sinh viên</h1>
        <p>Xin chào {user?.username || "User"}, chúc bạn một ngày tốt lành!</p>
      </div>

      <div className="home-content">
        <Slider {...sliderSettings} className="image-gallery">
          <div>
            <img src={pic1} alt="Hình ảnh 1" className="image-item" />
          </div>
          <div>
            <img src={pic2} alt="Hình ảnh 2" className="image-item" />
          </div>
        </Slider>
      </div>

      <footer className="footer">
        <p>Địa chỉ: 123 Đường XYZ, thành phố Mặt Trăng, tỉnh Mặt Trời</p>
        <p>Email: info@universityabc.edu.vn | Điện thoại: (0123) 456-7890</p>
      </footer>
    </div>
  );
};

export default HomePage;