import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { Select } from 'antd';


const { Option } = Select;

const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser?.user);

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const [selectedClassId, setSelectedClassId] = useState('');

  // useEffect(() => {
  //   if (accountUser?.accessToken) {
  //     getClass(accountUser.accessToken, dispatch);
  //   }
  // }, [accountUser, dispatch]);

  // useEffect(() => {
  //   if (selectedClass) {
  //     setSelectedClassId(selectedClass.class_id);
  //   }
  // }, [selectedClass]);

  // const handleClassChange = (value) => {
  //   const selectedClass = classList.find((cls) => cls.class_id === value);
  //   if (selectedClass) {
  //     dispatch(setSelectedClass(selectedClass));
  //   }
  // }

  return (
    <nav className="navbar">
      {/* <div>
          {user?.role === 'teacher' &&(
              <div>
              <Select value={selectedClassId} style={{ width: 120 }} onChange={handleClassChange}>
                {classList?.map((cls) => (
                  <Option value={cls.class_id} key={cls.class_id}>{cls.class_name}</Option>
                ))}
              </Select>
              </div>
          )}
            {user?.role === 'admin' &&(
              <div>
              <Select value={selectedClassId} style={{ width: 120 }} onChange={handleClassChange}>
                {classList?.map((cls) => (
                  <Option value={cls.class_id} key={cls.class_id}>{cls.class_name}</Option>
                ))}
              </Select>
              </div>
          )}
      </div> */}
      
      {user ? (
        <>
          <p className="navbar-user"><span> Hi, {user.username}  </span> </p>
        </>
      ) : (    
        <>
          <Link to="/login" className="navbar-login"> Login </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
