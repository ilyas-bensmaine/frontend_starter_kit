import toast from 'react-hot-toast'
import { getUserLanguage } from '../configs/i18n'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@src/views/authentication/store'
import { useTranslation } from 'react-i18next'

export const baseURL = `http://admin.app.com:8000`
export const withCredentialsFlag = true

export default function useAxiosAPI() {
    // ** Hooks
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // ** Params
    axios.defaults.withCredentials = withCredentialsFlag
    axios.defaults.baseURL = baseURL
    axios.defaults.params = { language: getUserLanguage() }
    const axiosAPI = axios.create({
        headers: {
            'Content-Type': 'application/json'
        }
    })
    axiosAPI.interceptors.response.use((response) => response, (error) => {
        switch (error.response?.status) {
            case 400:
                toast.error(t('Error 400: Bad request (something worng with URL or parameters).'))
                break
            case 401:
                toast.error(t('Error 401: Unauthenticated, not logged in.'))
                dispatch(handleLogout())
                navigate('/login')
                break
            case 403:
                toast.error(t('Error 403: Unauthorized, access to requested page is forbidden.'))
                break
            case 404:
                toast.error(t(`Error 404: Bad request (page not exist).`))
                break
            case 419:
                toast.error(t(`Error 419: Sorry, your session has expired.`))
                break
            case 422:
                toast.error(t('Error 422: Validation failed.'))
                break
            case 429:
                toast.error(t('Error 429: Too much requests, please try later.'))
                break
            case 477:
                toast.error(t('Error 477: Custom error (check the console).'))
                break
            case 500:
                toast.error(t('Error 500: Server error.'))
                break
            default:
                break
        }
        throw error
    })
  return axiosAPI
}
