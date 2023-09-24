// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      localStorage.setItem('userData', JSON.stringify(action.payload))
    },
    handleLogout: state => {
      state.userData = {}
      localStorage.removeItem('userData')
    },
    handleAuthUserLanguage: (state, action) => {
      state.userData = {...state.userData, ...action.payload}
      localStorage.setItem('userData', JSON.stringify(state.userData))
    }
  }
})

export const { handleLogin, handleLogout, handleAuthUserLanguage } = authenticationSlice.actions

export default authenticationSlice.reducer
