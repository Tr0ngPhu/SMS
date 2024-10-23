import axios from "axios";

import { addCurriculumSuccess, curriculumFailed, curriculumStart, getCurriculumSuccess } from "../redux/curriculumSlice";


export const getCurriculum = async(accessToken, dispatch,faculty_id,major)=>{
    dispatch(curriculumStart());
    try {
        const res = await axios.post('/v1/subject/curriculum', {faculty_id:faculty_id, major: major},{
            headers:{token: `Bearer ${accessToken}`}
        });

        dispatch(getCurriculumSuccess(res.data))
    } catch (error) {
        dispatch(curriculumFailed())
    }
}

export const addCurriculum = async(accessToken,dispatch,data)=>{
    dispatch(curriculumStart());
    try {
        await axios.post('/v1/subject/add',data,{
            headers:{token: `Bearer ${accessToken}`}
        });

        dispatch(addCurriculumSuccess())
    } catch (error) {
        dispatch(curriculumFailed())
    }
}

export const addSemesterToCurriculum = async(accessToken,dispatch,data)=>{
    dispatch(curriculumStart());
    try {
        await axios.post('/v1/subject/curriculum/semester/add',data,{
            headers:{token: `Bearer ${accessToken}`}
        });

        dispatch(addCurriculumSuccess())
    } catch (error) {
        dispatch(curriculumFailed())
    }
}

export const removeSubjectByCurriculum = async(accessToken, dispatch,curriculumId,subjectId)=>{
    dispatch(curriculumStart());
    try {
        await axios.delete(`/v1/subject/curriculum/${curriculumId}/${subjectId}`,{
            headers:{token: `Bearer ${accessToken}`}
        });

        dispatch(addCurriculumSuccess())
    } catch (error) {
        dispatch(curriculumFailed())
    }
}
