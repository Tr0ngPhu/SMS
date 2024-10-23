import { createSlice } from "@reduxjs/toolkit";

const semesterSlice = createSlice({
    name:'semester',
    initialState:{
        semesters:{
            allSemester: [],
            selectedSemester: null,
            isfetching: false,
            error: false,
            success: false
        },
        mgs:""
    },
    reducers:{
        getSemesterStart:(state)=>{
            state.semesters.isfetching= true
        },
        getSemesterSuccess:(state,action)=>{
            state.semesters.isfetching= false
            state.semesters.allSemester= action.payload
        },
        getSemesterFailed:(state)=>{
            state.semesters.error= true
        },
        
        createSemesterStart:(state)=>{
            state.semesters.isfetching= true
        },
        createSemesterSuccess : (state)=>{
            state.mgs= "thêm môn học thành công"
        } ,
        createSemesterFailed : (state)=>{
            state.mgs= "thêm môn học thất bại"
        },
        setSelectedSemesterSuccess: (state, action) => {
            state.semesters.selectedSemester = action.payload; // Lưu học kỳ đã chọn
        },



    }
});

export const{
    getSemesterFailed,
    getSemesterStart,
    getSemesterSuccess,

    createSemesterFailed,
    createSemesterStart,
    createSemesterSuccess,
    setSelectedSemesterSuccess

}= semesterSlice.actions

export default semesterSlice.reducer