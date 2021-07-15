import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { login, signup } from './userAPI';
import api from "../../helpers/api";

const initialState = {
    userDetails:  localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
};


export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, {rejectWithValue}) => {
      try{
        const response = await api.post("/users/login", { email, password });
        return response.data;
      }catch(err){
        console.log(err)
        return rejectWithValue(err)
      }

  }
);

export const signupUser = createAsyncThunk(
    'user/signupUser',
    async ({ name, email, password }, {rejectWithValue}) => {
        try{
            const response = await api.post("/users/register", { name, email, password });
            console.log(response)
            return response.data;
        }catch(err){
           return rejectWithValue(err)
        }
    }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, action) => {
        state.user = null;
        localStorage.removeItem("user");
      },
    clearState: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isFetching = false;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("scsses")
        state.isSuccess = true;
        state.userDetails = action.payload
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isSuccess = true;
          })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
      }) 
      .addCase(signupUser.rejected, (state, { payload }) => {
          console.log("reject")
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = payload.message;
      })
  },
});

export const { logout, clearState } = userSlice.actions;

export const userSelector = (state) => state.user.userDetails;
export const selectStatus = (state) => state.user;



export default userSlice.reducer;
