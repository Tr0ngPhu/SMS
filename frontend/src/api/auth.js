import axios from "axios";
import { loginStart,loginSuccess , loginFailed, registerStart, registerSuccess, registerFailed, logOutStart, logOutSuccess, logOutFailed, getAccountsStart, getAccountsSuccess, getAccountsFailed} from "../redux/authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('/v1/auth/login', user);
        dispatch(loginSuccess(res.data));
        navigate("/");
        return { success: true };
    } catch (error) {
        dispatch(loginFailed());
        return { success: false };
    }
};

export const registerUser = async(user, dispatch)=>{
        dispatch(registerStart());

    try {
        await axios.post('/v1/auth/register', user);
        dispatch(registerSuccess());
    } catch (error) {
        dispatch(registerFailed());
    }
};

export const logout = async(dispatch,id,navigate ,accessToken, axiosJWT)=>{
    dispatch(logOutStart());
    try {
        await axiosJWT.post('/v1/auth/logout',id ,{
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(logOutSuccess());
        navigate('/login')
    } catch (error) {
        console.error("Logout failed:", error);
        dispatch(logOutFailed());
    }
}