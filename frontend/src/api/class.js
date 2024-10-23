import axios from "axios";
import { classFailed, classStart, getClassSuccess, createClassSuccess, deleteClassSuccess, } from "../redux/classSlice";
import { getUserIdSuccess, updateIdFailed } from '../redux/userSlice';
import { addStudentFailed, addStudentStart, addStudentSuccess, deleteStudentFailed, deleteStudentStart, deleteStudentSuccess, getStudentFailed, getStudentStart, getStudentSuccess, updateUserStart } from "../redux/studentSlice";

export const getClass = async(accessToken,dispatch,facultyId)=>{
    dispatch(classStart());
    try {
        const res = await axios.post('/v1/class/',{faculty_id:facultyId},{
            headers: {token: `Beaerer ${accessToken}`}
        });
        dispatch(getClassSuccess(res.data));
    } catch (error) {
        dispatch(classFailed());
    }
};


export const createClass = async( accessToken,dispatch, teacherId, data )=>{
    dispatch(classStart());
    try {
        const res = await axios.post('/v1/class/create/'+ teacherId, data,{
            headers: { token: `Bearer ${accessToken}`}
        })
        dispatch(createClassSuccess(res.data))
    } catch (error) {
        dispatch(classFailed());
    }
  
};

export const deleteClass = async (accessToken, dispatch, id) => {
    dispatch(classStart());
    try {
        const res = await axios.delete('/v1/class/' + id, {
            headers: { token: `Bearer ${accessToken}` }
        })
        dispatch(deleteClassSuccess(res.data));
    } catch (error) {
        dispatch((deleteClassSuccess()))
    }
};




//

export const getStudentByClass = async (accessToken, dispatch ,classId,)=>{
    dispatch(getStudentStart());

    try {
        const res = await axios.get('/v1/class/'+classId, {
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(getStudentSuccess(res.data))
    } catch (error) {
        dispatch(getStudentFailed());
    }
};
export const addStudentToClass = async (accessToken, dispatch, classId,vnu_id) => {
    dispatch(addStudentStart());

    try {
        const res = await axios.post( `/v1/class/addStudent/${classId}`, {studentId: vnu_id}, 
            {
                headers: {token: `Bearer ${accessToken}`}
            }
        );
        dispatch(addStudentSuccess(res.data));
    } catch (err) {
        console.error('Error adding student to class:', err);
        dispatch(addStudentFailed());
    }
};

export const deleteStudent = async (accessToken, dispatch, classId,id)=> {
    dispatch(deleteStudentStart());
    try {
        const res = await axios.delete(`/v1/class/${classId}/${id}`, {
            headers:{token: `Bearer ${accessToken}`}
        });
        dispatch(deleteStudentSuccess(res.data))
    } catch (error) {
        dispatch(deleteStudentFailed());
    }
};
export const updateStudent = async (accessToken, dispatch, classId, studentId, studentData) => {
    try {
        const response = await axios.put(`/v1/class`, studentData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch({ type: 'UPDATE_STUDENT_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_STUDENT_FAILURE', payload: error });
    }
};
