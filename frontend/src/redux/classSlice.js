import { createSlice } from "@reduxjs/toolkit";

const classSlice = createSlice({
    name:"class",
    initialState:{
        classes:{
            classes: null,
            isfetching: false,
            error: false,
            success:false
        },
        msg:""
    },

    reducers:{
        classStart:(state)=>{
            state.classes.isfetching = true
        },
        classFailed:(state)=>{
            state.classes.isfetching= false
            state.classes.error = true
        },
        getClassSuccess:(state, action)=>{
            state.classes.isfetching= false
            state.classes.classes= action.payload
        },
       
        createClassSuccess:(state,action)=>{
            state.classes.isfetching=false
            state.classes.success = false
        },

        deleteClassSuccess:(state,action)=>{
            state.classes.isfetching = false
            state.msg= action.payload
        },
      
    }
});

export const{
    classFailed,
    classStart,
    getClassSuccess,
    createClassSuccess,
    deleteClassSuccess,
 
}= classSlice.actions

export default classSlice.reducer