// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    columns_visibilities:{
      name: {name: "Nom et Prénom", arabic_name: "الإسم واللقب", value:false},
      email: {name: "Email", arabic_name: "البريد الإلكتروني", value:false},
      phone: {name: "Phone", arabic_name: "الهاتف", value:false},
      wilaya: {name: "Wilaya", arabic_name: "الولاية", value:false},
      profession: {name: "Profession", arabic_name: "الوضعية", value:false},
      plan: {name: "Abonnement actuel", arabic_name: "الإشتراك الحالي", value:false},
      status: {name: "Etat", arabic_name: "الحالة", value:false},
      actions: {name: "Actions", arabic_name: "العمليات", value:false}
    },
    sortParams:{
      page : 1,
      perPage : 10,
      sort : '-id'
    },
    filterParams:{
      searchTerm: ''
    }
  },
  reducers: {
    handleUsersColumnsVisibilitiesUpdates: (state, action) => {
      state.columns_visibilities = {...state.columns_visibilities, ...action.payload}
    },
    handleUsersSortParamsUpdates: (state, action) => {
      state.sortParams = {...state.sortParams, ...action.payload}
    },
    handleUsersFilterParamsUpdates: (state, action) => {
      state.filterParams = {...state.filterParams, ...action.payload}
    },
    handleUsersFilterParamsCleared: (state) => {
      state.filterParams = {
        searchTerm: '',
        status: '',
        visibility: '',
        role: ''
      }
    }
  }
})

export const { 
    handleUsersColumnsVisibilitiesUpdates,
    handleUsersSortParamsUpdates,
    handleUsersFilterParamsUpdates,
    handleUsersFilterParamsCleared
  } = usersSlice.actions

export default usersSlice.reducer
