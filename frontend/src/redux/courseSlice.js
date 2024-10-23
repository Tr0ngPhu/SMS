import { createSlice } from "@reduxjs/toolkit";
import Schedule from "../Components/Classes/Schedule";
import { getStudentSuccess } from "./studentSlice";


const courseSlice = createSlice({
    name:'course',
    initialState:{
        courses:{
            courses:[],
            success: false,
            error: false,
            isfetching:false
        },

        registerCourse:{
            courses:[],
            success: false,
        },

        schedule: [] ,
        students:[],
        msg:''
    },

    reducers:{
        courseStart:(state)=>{
            state.courses.isfetching = true
        },
        courseFailed:(state)=>{
            state.courses.isfetching = false
            state.courses.error = true

        },
        getCourseClassSuccess:(state,action)=>{
            state.courses.isfetching = false
            state.courses.courses = action.payload
        },

        createCourseSuccess:(state)=>{
            state.courses.isfetching = false
            state.courses.success = true
        },

        deleteCourseSuccess: (state)=>{
            state.courses.isfetching = false
            state.courses.success = true

        },

        settingRegisterCourseSuccess:(state)=>{
            state.courses.isfetching = false
            state.courses.success = true
        },

        registerCourseSuccess:(state)=>{
            state.registerCourse.success = true
        },

        getRegisteredCoursesSuccess:(state, action)=>{
            state.registerCourse.courses = action.payload
        },

       
        cancelCourseSuccess:(state)=>{
            state.registerCourse.success= true
        },

        getScheduleSuccess :(state, action)=>{
            state.schedule = action.payload
        },
        getStudentCourseSuccess:(state,action)=>{
            state.students = action.payload
        }
    }
})


export const {
    courseFailed,
    courseStart,

    getCourseClassSuccess,
    createCourseSuccess,
    deleteCourseSuccess,
    settingRegisterCourseSuccess,
    registerCourseSuccess,
    getRegisteredCoursesSuccess,
    getRegisteredCoursesFailed,

    cancelCourseSuccess,

    getScheduleSuccess,
    getStudentCourseSuccess
}= courseSlice.actions
export default courseSlice.reducer