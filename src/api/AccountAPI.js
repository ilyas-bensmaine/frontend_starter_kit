import useAxiosAPI from "./useAxiosAPI"

export function useGetAuthUserNotification() {
    const axiosAPI = useAxiosAPI()
    return async (currentPage, perPage) => {
        try {
            const response = await axiosAPI.get(`/api/admin/account/get_notifications?page=${currentPage}&perPage=${perPage}`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }
}

