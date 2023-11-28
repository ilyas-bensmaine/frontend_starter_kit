import { getUserLanguage } from "../../configs/i18n"
import qs from "qs"
import useAxiosAPI from "../useAxiosAPI"

export function useGetUsers() {
    const axiosAPI = useAxiosAPI()
    return async (sortParams, filterParams) => {
        try {
            const response = await axiosAPI.get(`/api/admin/users?language=${getUserLanguage()}&page=${sortParams.page}&perPage=${sortParams.perPage}&sort=${sortParams.sort}`, {
                params: {
                    ...filterParams
                  },
                  paramsSerializer: () => {
                    return qs.stringify({filter: {...filterParams}}, { encode: false})
                  }
            })
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}

export function useGetUser() {
    const axiosAPI = useAxiosAPI()
    return async (id) => {
        try {
            const response = await axiosAPI.get(`api/admin/users/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}

export function useGetUserForEdit() {
    const axiosAPI = useAxiosAPI()
    return async (id) => {    
        try {
            const response = await axiosAPI.get(`api/admin/users/${id}/edit`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}

export function useAddUser() {
    const axiosAPI = useAxiosAPI()
    return async (key, data) => {
        try {
            const response = await axiosAPI.post('/api/admin/users', data.arg)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}

export function useUpdateUser() {
    const axiosAPI = useAxiosAPI()
    return async (key, data) => {
        try {
            const response = await axiosAPI.post(`/api/admin/users/${data.arg?.id}`, { ...data.arg?.data, _method: 'patch' })
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export function useDeleteUser() {
    const axiosAPI = useAxiosAPI()
    return async (key, data) => {
        try {
            const response = await axiosAPI.delete(`/api/admin/users/${data.arg?.id}`)
            return response.data
        } catch (error) {
            throw error
        }
    }
}
