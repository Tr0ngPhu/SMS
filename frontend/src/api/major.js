import axios from "axios";
import {majorStart,majorFailed, getMajorSuccess, createMajorSuccess ,deleteMajorSuccess, getMajorByFacultySuccess} from "../redux/majorSlice";

export const getMajor = async(accessToken, dispatch)=>{
    dispatch(majorStart());
    try {
        const res = await axios.get(`/v1/major/`,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(getMajorSuccess(res.data))
    } catch (error) {
        dispatch(majorFailed());
    }
}

export const getMajorByFacultyId = async(accessToken,dispatch, id)=>{
    dispatch(majorStart());
    try {
        const res =await axios.post(`v1/major/facultyid`, {faculty_id: id}, {
            headers:{token :`Bearer ${accessToken}`}
        })
        dispatch(getMajorByFacultySuccess(res.data))
    } catch (error) {
        dispatch(majorFailed);
    }
}

export const createMajor = async(accessToken, dispatch, data)=>{
    dispatch(majorStart());
    try {
        await axios.post(`/v1/major/create`,data,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(createMajorSuccess())
    } catch (error) {
        dispatch(majorFailed())
    }
}

export const deleteMajor = async(accessToken, dispatch, id)=>{
    dispatch(majorStart());
    try {
        await axios.delete(`/v1/major/${id}`,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(deleteMajorSuccess())
    } catch (error) {
        dispatch(majorFailed())
    }
};
