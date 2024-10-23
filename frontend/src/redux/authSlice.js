import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        login:{
            currentUser: null,
            isfetching: false,
            error: false,
        },
        register:{
            isfetching:false,
            error:false,
            success: false
        },
        accounts:{
            account: null,
        },
        isfetching: false,
        error: false
    },
    reducers:{
        loginStart:(state)=>{
            state.login.isfetching=true;
        },
        loginSuccess:(state, action)=>{
            state.login.isfetching= false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed:(state)=>{
            state.login.isfetching= false;
            state.login.error = true;
        },


        registerStart:(state)=>{
            state.register.isfetching=true;
        },
        registerSuccess:(state)=>{
            state.register.isfetching= false;
            state.register.error = false;
            state.register.success= true;
        },
        
        registerFailed:(state)=>{
            state.register.isfetching= false;
            state.register.error = true;
        },


        logOutStart:(state)=>{
            state.login.isfetching=true;
        },
        logOutSuccess:(state, action)=>{
            state.login.isfetching= false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailed:(state)=>{
            state.login.isfetching= false;
            state.login.error = true;
        },

        getAccountsStart:(state)=>{
            state.isfetching= true
        },
        getAccountsSuccess:(state,action)=>{
            state.isfetching= false
            state.accounts.account= action.payload
        },
        getAccountsFailed:(state)=>{
            state.isfetching= false
            state.error= true
        }


    }


})

export const{
    loginStart,
    loginSuccess,
    loginFailed,

    registerFailed,
    registerStart,
    registerSuccess,

    logOutFailed,
    logOutStart,
    logOutSuccess,
    
    getAccountsFailed,
    getAccountsSuccess,
    getAccountsStart

}= authSlice.actions;

export default authSlice.reducer;