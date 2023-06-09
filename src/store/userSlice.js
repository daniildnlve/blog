import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BlogService from '../services/blog-service'
const blogService = new BlogService()

export const getUserDataThunk = createAsyncThunk('user/getUserDataThunk', async function (token) {
  const res = await blogService.getCurrentUser(token)
  if (!res.ok) {
    throw new Error()
  }
  return res
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuth: null,
    email: '',
    username: '',
    image: '',
    token: '',
  },
  reducers: {
    logOutUser(state) {
      state.isAuth = false
      state.username = ''
      state.image = ''
      state.token = ''
    },
    loadHeader(state) {
      state.isAuth = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserDataThunk.fulfilled, (state, action) => {
      state.isAuth = true
      state.username = action.payload.result.user.username
      state.image = action.payload.result.user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'
      state.email = action.payload.result.user.email
      state.token = action.payload.result.user.token
    })
  },
})

export const { logOutUser, loadHeader } = userSlice.actions
export default userSlice.reducer
