import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
    name: "student",
    initialState: {
        students: {
            allStudent: [],
            isFetching: false,
            error: null,
            success: false   
        },
        msg:""
    },
    reducers: {
        getStudentStart: (state) => {
            state.students.isFetching = true;
        },
        getStudentSuccess: (state, action) => {
            state.students.isFetching = false;
            state.students.allStudent = action.payload;
            state.students.error = null;
        },
        getStudentFailed: (state) => {
            state.students.isFetching = false;
            state.students.error = true;
        },
        addStudentStart: (state) => {
            state.students.isFetching = true;
            state.students.error = false;
        },
        addStudentSuccess: (state) => {
            state.students.isFetching = false;
            state.students.success = true;
            state.students.error = false;
            state.msg = "Thêm sinh viên thành công"
        },
        addStudentFailed: (state,action) => {
            state.students.isFetching = false;
            state.students.error = true;
            state.msg = action.payload
        },
        deleteStudentStart:(state)=>{
            state.students.isFetching= true
        },
        deleteStudentSuccess: (state)=>{
            state.students.isFetching = false;
            state.students.success = true;
            state.students.error = false;
            state.msg = "Xóa sinh viên thành công"
        },
        deleteStudentFailed:(state,action)=>{
            state.students.isFetching = false;
            state.students.error = true;
            state.msg = action.payload
        },
        updateUserStart:(state)=>{
            state.users.isFetching = true;
        },
        updateUserSuccess:(state, action)=>{
            state.users.isFetching= false;
            state.msg = "Cập nhật thông tin sinh viên thành công";
        },
        updateUserFailed:(state, action)=>{
            state.users.isFetching= false;
            state.users.error= true;
            state.msg = "Cập nhật thông tin sinh viên thất bại";
        }
    }
});

export const {
    getStudentFailed,
    getStudentStart,
    getStudentSuccess,
    addStudentFailed,
    addStudentStart,
    addStudentSuccess,
    deleteStudentFailed,
    deleteStudentStart,
    deleteStudentSuccess,
    updateUserStart,
    updateUserSuccess,
    updateUserFailed
} = studentSlice.actions;

export default studentSlice.reducer;
