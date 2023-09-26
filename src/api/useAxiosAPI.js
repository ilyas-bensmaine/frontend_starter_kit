import axios from 'axios'
import toast from 'react-hot-toast'
import { getUserLanguage } from '../configs/i18n'

export default function useAxiosAPI() {
    axios.defaults.withCredentials = true
    axios.defaults.baseURL = `http://admin.app.com:8000`
    axios.defaults.params = { language: getUserLanguage() }

    const axiosAPI = axios.create({
        headers: {
            'Content-Type': 'application/json'
        }
    })
    axiosAPI.interceptors.response.use((response) => response, (error) => {
        switch (error.response?.status) {
            case 400:
                toast.error('Error 400: Bad request (something worng with URL or parameters).')
                break
            case 401:
                toast.error('Error 401: Unauthenticated, not logged in.')
                break
            case 403:
                toast.error('Error 403: Unauthorized, access to requested page is forbidden.')
                break
            case 404:
                toast.error(`Error 404: Bad request (page not exist).`)
                break
            case 419:
                toast.error(`Error 419: Sorry, your session has expired.`)
                break
            case 422:
                toast.error('Error 422: Validation failed.')
                break
            case 429:
                toast.error('Error 429: Too much requests.')
                break
            case 477:
                toast.error('Error 477: Costum error (check the console)')
                break
            case 500:
                toast.error('Error 500: General server error')
                break
            default:
                break
        }
        throw error
    })
  return axiosAPI
}
