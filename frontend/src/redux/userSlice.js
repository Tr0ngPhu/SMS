import{createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState:{
        users:{
            allUsers :null,
            isFetching: false,
            error: false,
            profile: null
        },
        msg:"",
        failed: false
    },

    reducers:{
        getUserStart: (state) =>{
            state.users.isFetching= true;
        },
        getUserSuccess:(state, action)=>{
            state.users.isFetching= false;
            state.users.allUsers = action.payload;
        },
        getUserFailed: (state) =>{
            state.users.isFetching= false;
            state.users.error = true;   
        },
        deleteUserStart:(state)=>{
            state.users.isFetching = true;
        },
        deleteUserSucsess:(state, action)=>{
            state.users.isFetching= false;
            state.msg = action.payload;
        },
        deleteUserFailed:(state, action)=>{
            state.users.isFetching= false;
            state.users.error= true;
            state.msg = action.payload;
        },
        getProfileSuccsess: (state,action)=>{
            state.users.isFetching= false
            state.users.profile= action.payload
        },
        
    
    }


})

export const {
    getUserFailed,
    getUserStart,
    getUserSuccess,
    deleteUserFailed,
    deleteUserStart,
    deleteUserSucsess,
    getProfileSuccsess,

} = userSlice.actions

export default userSlice.reducer;