import useAxiosAPI from "../useAxiosAPI"

export function useGetUserProfessions() {
    const axiosAPI = useAxiosAPI()
    return async () => {
        try {
            const response = await axiosAPI.get(`/api/admin/user_professions`)
            return response.data
        } catch (error) {
            throw error
        }
    }
}

