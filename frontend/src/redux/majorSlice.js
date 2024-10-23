import { createSlice } from "@reduxjs/toolkit";

const majorSlice = createSlice({
    name:"major",
    initialState:{
        majors:{
            majors:[],
            majorsByFaculty:[],
            success: false,
            error: false,
            isfetching:false
        },
        msg:""
    },

    reducers:{
        majorStart:(state)=>{
            state.majors.isfetching= true
        },
        majorFailed:(state)=>{
            state.majors.isfetching= false
            state.majors.error= true
        },

        getMajorSuccess:(state, action)=>{
            state.majors.isfetching= false
            state.majors.majors= action.payload
        },
        getMajorByFacultySuccess:(state, action)=>{
            state.majors.isfetching= false
            state.majors.majorsByFaculty= action.payload
        },
        createMajorSuccess:(state)=>{
            state.majors.isfetching = false
            state.majors.success = true
        },
        deleteMajorSuccess:(state)=>{
            state.majors.isfetching = false
            state.majors.success = true
        }
    }
})
export const {
    majorStart, majorFailed,

    getMajorSuccess,
    getMajorByFacultySuccess,
    createMajorSuccess,
    deleteMajorSuccess
}= majorSlice.actions

export default majorSlice.reducer