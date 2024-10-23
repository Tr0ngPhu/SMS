import axios from "axios";
import { createSubjectFailed, createSubjectStart, createSubjectSuccess, deleteSubjectSuccess, getSubjectBySemesterIdSuccess, getSubjectFailed, getSubjectStart, getSubjectSuccess } from "../redux/subjectSlice";


export const getSubject = async (accessToken,dispatch,id)=>{
    dispatch(getSubjectStart());
    try {
        const res = await axios.post(`/v1/subject/`,{faculty_id:id},{
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(getSubjectSuccess(res.data));
    } catch (error) {
        dispatch(getSubjectFailed());
    }
};

export const deleteSubject = async(accessToken,dispatch,id)=>{
    try {
       const res =  await axios.delete(`/v1/subject/delete/${id}`,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(deleteSubjectSuccess(res.data));
    } catch (error) {
        console.log({message:error});
    }
}

export const createSubject = async(accessToken,dispatch, data) =>{
    dispatch(createSubjectStart())
    try {
        const res = await axios.post(`/v1/subject/create`,data,{
            headers:{token: `Bearer ${accessToken}` }
        })
        dispatch(createSubjectSuccess(res.data))
    } catch (error) {
        dispatch(createSubjectFailed());
    }
}
