import axios from "axios";
import { Failed, getFacultySuccess, Start } from "../redux/facultySlice";


export const getFaculty = async (accessToken, dispatch)=>{
    dispatch(Start());

    try {
        const res = await axios.get(`/v1/faculty/`, {
            headers:{token:`Bearer ${accessToken}`}
        })
        dispatch(getFacultySuccess(res.data))
    } catch (error) {
        dispatch(Failed());
    }
}

export const createFaculty= async(accessToken, dispatch, data)=>{
    dispatch(Start());
    try {
        await axios.post(`/v1/faculty/create`,data, {
            headers:{token:`Bearer ${accessToken}`}
        })
    } catch (error) {
        dispatch(Failed());
    }
}

export const deleteFaculty = async(accessToken,dispatch, id)=>{
    dispatch(Start());
    try {
        await axios.delete(`/v1/faculty/${id}`,{
            headers:{token: `Bearer ${accessToken}`}
        })
    } catch (error) {
        dispatch(Failed());
    }
}
