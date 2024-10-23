import { createSlice } from "@reduxjs/toolkit";

const curriculumSlice = createSlice({
    name:'curriculum',
    initialState:{
        curriculums:{
            curriculums:[],
            success: false,
            error: false,
            isfetching:false
        },
        registrationSubject:{
            subjects:[]
        },
        msg:''
    },

    reducers:{
        curriculumStart:(state)=>{
            state.curriculums.isfetching = true
        },
        curriculumFailed:(state)=>{
            state.curriculums.isfetching = false
            state.curriculums.error= true
        },

        getCurriculumSuccess:(state, action)=>{
            state.curriculums.isfetching = false
            state.curriculums.curriculums= action.payload
        },
        addCurriculumSuccess:(state)=>{
            state.curriculums.isfetching = false
            state.curriculums.success = true
        },
        deleteCurriculumSuccess:(state)=>{
            state.curriculums.isfetching = false
            state.curriculums.success = true
        },
        getRegistrationSubjectsSuccess:(state, action)=>{
            state.curriculums.isfetching = false
            state.registrationSubject.subjects= action.payload
        },
    }

})

export const{
    curriculumFailed,
    curriculumStart,

    getCurriculumSuccess,
    addCurriculumSuccess,
    deleteCurriculumSuccess,

    getRegistrationSubjectsSuccess
}= curriculumSlice.actions

export default curriculumSlice.reducer