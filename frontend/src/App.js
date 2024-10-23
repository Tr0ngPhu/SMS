import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import Newfeed from './Components/Newfeed/Newfeed.jsx';
import Menu from "./Components/Menu/Menu";
import HomePage from "./Components/Home/HomePage";
import Login from "./Components/Login/Login";
import Register from "./Components/Account/Register";
import NavBar from "./Components/NavBar/NavBar";
import StudentsList from "./Components/StudentList/StudentList";
import Classlist from "./Components/Classes/ClassList";
import ScoreTable from "./Components/Score/scoreTable";
import MyScore from "./Components/Score/MyScore";
import Program from "./Components/Program/program";
import Account from "./Components/Account/Account";
import Profile from "./Components/Account/UserProfile";
import FacultyList from "./Components/Faculties/FacultyList";
import MajorList from "./Components/Faculties/MajorList";
import SubjectList from "./Components/Program/subject";
import CoursesClass from "./Components/Classes/CoursesClass";
import SubjectSelection from "./Components/Classes/SubjectSelection";
import RegisterCourse from "./Components/Classes/RegisterCourse";
import Schedule from "./Components/Classes/Schedule";
import CourseStudents from './Components/StudentList/CourseStudents'
import 'antd/dist/reset.css';
import { useNavigate } from "react-router-dom";

const TokenCheck = ({ children }) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (accessToken) {
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1])); // Giải mã payload của token
        const expirationTime = tokenPayload.exp * 1000; // Thời gian hết hạn tính bằng milliseconds

        if (Date.now() >= expirationTime) {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    checkTokenExpiration();
  }, [accessToken, navigate]);

  return children;
};

function App() {
  const user = useSelector((state) => state.auth.login.currentUser);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {user && <NavBar />}

        <div className="layout">
          {user && <Menu />}
          <TokenCheck>
            <div className="content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/class" element={<Classlist />} />
                <Route path="/student/:classId" element={<StudentsList />} />
                {/* <Route path="/scores/:classId" element={<ScoreTable />} />
                <Route path="/scores/myScore" element={<MyScore />} /> */}
                <Route path="/newfeed" element={<Newfeed />} /> 
                <Route path="/program" element={<Program />} />
                <Route path="/account" element={<Account />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/faculty" element={<FacultyList />} />
                <Route path="/major" element={<MajorList />} />
                <Route path="/subject" element={<SubjectList />} />
                <Route path="/courses" element={<CoursesClass />} />
                <Route path="/register-courses/subjects" element={<SubjectSelection />} />
                <Route path="/register-courses/course" element={<RegisterCourse />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/course/:classId" element={<CourseStudents />} />

              </Routes>
            </div>
          </TokenCheck>
        </div>
      </div>
    </Router>
  );
}

export default App;
