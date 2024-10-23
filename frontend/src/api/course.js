import axios from "axios";
import { courseFailed, courseStart, createCourseSuccess, deleteCourseSuccess, getCourseClassSuccess, getRegisteredCoursesFailed, getRegisteredCoursesSuccess, getScheduleSuccess, getStudentCourseSuccess, getStudentSuccess, registerCourseSuccess, settingRegisterCourseSuccess } from "../redux/courseSlice";
import { getRegistrationSubjectsSuccess } from "../redux/curriculumSlice";

export const getCourseClass = async(accessToken,dispatch,subjectId)=>{
    dispatch(courseStart());
    try {
        const res = await axios.post(`/v1/courseclass/`,{subject:subjectId},{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(getCourseClassSuccess(res.data))
    } catch (error) {
        dispatch(courseFailed())
    }
}


export const settingRegisterCourse = async (accessToken, dispatch, setingData) =>{
    dispatch(courseStart());
    try {
        await axios.post(`/v1/courseclass/registration-setting`,setingData,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(settingRegisterCourseSuccess())
    } catch (error) {
        dispatch(courseFailed())
    }
}

export const getRegistrationSubjectsList = async(accessToken,dispatch,semesterId)=>{
    dispatch(courseStart());
    try {
        const res = await axios.post(`/v1/courseclass/curriculum`,{semester_id:semesterId},{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(getRegistrationSubjectsSuccess(res.data))
    } catch (error) {
        dispatch(courseFailed())
    }
}

export const createCourse = async (accessToken,dispatch, data)=>{
    dispatch(courseStart());
    try {
        const res = await axios.post(`/v1/courseclass/create`, data ,{
            headers : {token: `Bearer ${accessToken}`}
        })
        dispatch(createCourseSuccess(res.data));
    } catch (error) {
        dispatch(courseFailed())
    }
}

export const deleteCourseClass = async(accessToken, dispatch, id)=>{
    dispatch(courseStart());
    try {
        await axios.delete(`/v1/courseclass/${id}`, {
             headers : {token: `Bearer ${accessToken}`}
        })
        dispatch(deleteCourseSuccess());
    } catch (error) {
        dispatch(courseFailed())
    }
}
export const registerCourse = async(accessToken,dispatch, courseData)=>{
    dispatch(courseStart());
    try {
        await axios.post(`/v1/courseclass/register`, courseData, {
            headers:{token: `Bearer ${accessToken}`}
        });
        dispatch(registerCourseSuccess());
    } catch (error) {
        dispatch(courseFailed())
    }
}

export const getRegisteredCourses = async(accessToken,dispatch,semesterId)=>{
    dispatch(courseStart());
    try {
       const res =  await axios.post(`/v1/courseclass/get-courses-registered`, {semester_id: semesterId}, {
            headers:{token: `Bearer ${accessToken}`}
        });
        dispatch(getRegisteredCoursesSuccess(res.data));
    } catch (error) {
        dispatch(courseFailed());

    }
}


export const cancelCourse = async(accessToken,dispatch, courseId)=>{
    dispatch(courseStart());
    try {
        const res =  await axios.delete(`/v1/courseclass/${courseId}`, {
            headers:{token: `Bearer ${accessToken}`}
        });
        dispatch(getRegisteredCoursesSuccess(res.data));
    } catch (error) {
        dispatch(courseFailed())

    }
}

export const getSchedule = async (accessToken,dispatch,semesterId) =>{
    try {
        const res = await axios.post(`/v1/courseclass/schedule`,{semester_id: semesterId}, {
            headers:{token: `Bearer ${accessToken}`}
        });
        dispatch(getScheduleSuccess(res.data));
    } catch (error) {
        console.log(error);
    }
}

export const getStudentByCourseClass = async (accessToken,dispatch,id) =>{

    dispatch(courseStart());
    try {
       const res =  await axios.get(`/v1/courseclass/students/${id}`, {
                headers : {token: `Bearer ${accessToken}`}
        })
        dispatch(getStudentCourseSuccess(res.data));
    } catch (error) {
        dispatch(courseFailed())
    }
    
}