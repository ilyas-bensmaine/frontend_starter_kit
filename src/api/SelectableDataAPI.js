import useAxiosAPI from "./useAxiosAPI"


export function useGetSelectableWilayas () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_wilayas`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}
export function useGetSelectableUserProfessions () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_user_professions`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}
export function useGetSelectablePlans () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_plans`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}
export function useGetSelectableUserStatuses () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_user_statuses`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    
    }
}
export function useGetSelectableCarTypes () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_car_types`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    
    }
}
export function useGetSelectableCarBrands () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_car_brands`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    
    }
}
export function useGetSelectablePartCategories () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_part_categories`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    
    }
}
export function useGetSelectablePartSubCategories () {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/selectable_part_sub_categories`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    
    }
}
