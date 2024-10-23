import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const facultySlice = createSlice({
    name:"faculty",
    initialState:{
        faculties:{
            faculty: [],
            isfetching: false,
            error : false,
            success: false
        },
        msg:""
    },

    reducers:{
        Start:(state)=>{
            state.faculties.isfetching= true
        },
        Failed:(state)=>{
            state.faculties.isfetching= false
            state.faculties.error= true
        },
        getFacultySuccess:(state, action)=>{
            state.faculties.isfetching= false
            state.faculties.faculty = action.payload
        },
        createFacultySuccess: (state)=>{
            state.faculties.isfetching= false
            state.faculties.success = true
        },
        deleteFacultySuccess: (state)=>{
            state.faculties.isfetching= false
            state.msg = {message: "Xóa thành công"}
        }
       
    }
})

export const {
    Start, Failed,

    getFacultySuccess,
    createFacultySuccess,
    deleteFacultySuccess

}= facultySlice.actions


export default facultySlice.reducer