import { createSlice } from "@reduxjs/toolkit";

const scoreSlice = createSlice({
    name: 'score',
    initialState:{
        scores:{
            allScore: [],
            isfetching: false,
            error : false,
            success:false,
            myScore: null,
            scoreStudent:null
        },
        msg:""
    },
    reducers:{
        getScoreStart:(state) =>{
            state.scores.isfetching = true
        },

        getScoreSuccess: (state ,action) =>{
            state.scores.isfetching = false
            state.scores.allScore = action.payload
        },

        getScoreFailed: (state)=>{
            state.scores.isfetching = false
            state.scores.error = true
        },

        addScoreStart:(state) =>{
            state.scores.isfetching = true
        },
        addScoreSuccess:(state) =>{
            state.scores.isfetching = false
            state.scores.success = true
            state.msg= "Nhập điểm thành công"
        },
        addScoreFailed:(state) =>{
            state.scores.isfetching = false
            state.scores.error = true
            state.msg= "nhập điểm thất bại"
        },
        getMyScoreSuccess:(state, action)=>{
            state.scores.isfetching = false
            state.scores.myScore= action.payload
        },

        getScoreStudentSuccsess:(state,action)=>{
            state.scores.isfetching = false
            state.scores.scoreStudent= action.payload
        }
        

    }
})

export const  {
    getScoreFailed,
    getScoreStart,
    getScoreSuccess,

    addScoreFailed,
    addScoreStart,
    addScoreSuccess,
    getMyScoreSuccess,
    getScoreStudentSuccsess
}= scoreSlice.actions

export default scoreSlice.reducer