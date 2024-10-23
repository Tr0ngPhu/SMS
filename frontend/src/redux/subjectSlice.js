import { createSlice } from "@reduxjs/toolkit";

const subjectSlice = createSlice({
    name:'subject',
    initialState:{
        subjects:{
            subject: [],
            isfetching: false,
            error : false,
            success: false
        },
        subjectsBySemesterId:{
            subject:[],
        },
        msg:""
    },
    reducers:{
        getSubjectStart: (state)=>{
            state.subjects.isfetching= true
        },
        getSubjectSuccess: (state,action)=>{
            state.subjects.isfetching= false
            state.subjects.subject= action.payload
        },

        getSubjectBySemesterIdSuccess:(state,action)=>{
            state.subjects.isfetching= false
            state.subjectsBySemesterId.subject= action.payload
        },

        getSubjectFailed: (state)=>{
            state.subjects.error= true
        },
        createSubjectStart: (state)=>{
            state.subjects.isfetching= true
        },
        createSubjectSuccess: (state)=>{
            state.subjects.success= true
            state.msg = "Thêm môn học thành công"

        },
        createSubjectFailed: (state)=>{
            state.subjects.error= true
        },

        deleteSubjectSuccess:(state)=>{
            state.subjects.success = true
            state.msg= "xóa môn học thành công"
        }
        
    }
})

export const{
    getSubjectFailed,
    getSubjectStart,
    getSubjectSuccess,

    getSubjectBySemesterIdSuccess,

    createSubjectFailed,
    createSubjectStart,
    createSubjectSuccess,

    deleteSubjectSuccess
}= subjectSlice.actions

export default subjectSlice.reducer