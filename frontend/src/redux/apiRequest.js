import axios from "axios";
import { deleteUserFailed, deleteUserStart, deleteUserSucsess, getProfileSuccsess, getUserFailed, getUserStart, getUserSuccess } from "./userSlice";
import { addScoreFailed, addScoreStart, addScoreSuccess, getMyScoreSuccess, getScoreFailed, getScoreStart, getScoreStudentSuccsess, getScoreSuccess } from "./scoreSlice";
import {getAccountsStart, getAccountsSuccess, getAccountsFailed} from "../redux/authSlice";

///
export const getAllUser = async(accessToken, dispatch)=>{
    dispatch(getUserStart());

    try {
        const res = await axios.get('/v1/user',{
            headers: {token:`Bearer ${accessToken}`},
        });
        dispatch(getUserSuccess(res.data));
    } catch (error) {
        dispatch(getUserFailed());
    }
};

export const getAcccounts = async(accessToken,dispatch)=>{
    dispatch(getAccountsStart());
    try {
        const res = await axios.get(`/v1/auth/account`, {
            headers:{token: `Bearer ${accessToken}`}
        });

       dispatch(getAccountsSuccess(res.data))
    } catch (error) {
        console.log(error)
        dispatch(getAccountsFailed());
    }
}

export const deleteUser = async(accessToken, dispatch, id)=>{
    dispatch(deleteUserStart());
    try{
        const res = await axios.delete('/v1/user/'+ id, {
            headers: {token: `Bearer ${accessToken}`},
        });
        dispatch(deleteUserSucsess(res.data));
    }catch(err){
        dispatch(deleteUserFailed(err.response.data));
    }
};

export const getProfile = async(accessToken,dispatch)=>{
    dispatch(getUserStart());
    try {
        const res = await axios.get(`/v1/user/profile`, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(getProfileSuccsess(res.data));
    } catch (error) {
        dispatch(getUserFailed())
    }
}


export const getScoreClass = async (accessToken, dispatch, classId, params) => {
    dispatch(getScoreStart());
    try {
        const res = await axios.post(`/v1/score/scoreTableClass/${classId}`, params, {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(getScoreSuccess(res.data));
    } catch (error) {
        dispatch(getScoreFailed());
        console.error("Error in getScoreClass:", error);
    }
};

export const addScore= async(accessToken, dispatch, query)=>{
    dispatch(addScoreStart());
    try {
        const res = await axios.post(`/v1/score/add`, query,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(addScoreSuccess(res.data))
        return{success:true}
    } catch (error) {
        dispatch(addScoreFailed())
    }
}

export const getMyScore = async (accessToken,dispatch)=>{
    dispatch(getScoreStart());
    try {
        const res = await axios.get(`/v1/score/myscores`, {
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(getMyScoreSuccess(res.data))
    } catch (error) {
        dispatch(getScoreFailed())
    }
}

export const getScoreStudent = async (accessToken, dispatch, id)=>{
    dispatch(getScoreStart());
    try {
        const res = await axios.post(`/v1/score/scoreStudent`, {studentId:id},{
            headers:{token: `Bearer ${accessToken}`}
        });

        dispatch(getScoreStudentSuccsess(res.data));
    } catch (error) {
        dispatch(getScoreFailed());
    }
}

