import axios from "axios";
import { createSemesterFailed, createSemesterSuccess, getSemesterFailed, getSemesterStart, getSemesterSuccess } from "../redux/semesterSlice";


export const getSemester = async(accessToken, dispatch)=>{
    dispatch(getSemesterStart());
    try {
        const res = await axios.get(`/v1/semester/`,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(getSemesterSuccess(res.data))
    } catch (error) {
        dispatch(getSemesterFailed());
    }
}

export const createSemester = async(accessToken,dispatch,query)=>{
    dispatch(getSemesterStart());
    try {
        const res = await axios.post(`/v1/semester/add`,query,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(createSemesterSuccess(res.data));
    } catch (error) {
        dispatch(createSemesterFailed())
    }
}
