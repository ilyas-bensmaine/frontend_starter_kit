// ** Third Party Components
import { useTranslation } from 'react-i18next'
import ReactCountryFlag from 'react-country-flag'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import useAxiosAPI from '../../../../api/useAxiosAPI'
import { handleAuthUserLanguage } from '../../../../views/authentication/store'
import { useDispatch } from 'react-redux'
import { useRTL } from '../../../../utility/hooks/useRTL'

const IntlDropdown = () => {
  // ** Hooks
  const { i18n } = useTranslation()
  const axiosAPI = useAxiosAPI()
  const dispatch = useDispatch()
  const [isRtl, setIsRtl] = useRTL()

  // ** Vars
  const langObj = {
    fr: 'Français',
    ar: 'عربية'
  }

  // ** Function to switch Language
  const handleLangUpdate = async (e, lang) => {
    e.preventDefault()
    if (lang === 'ar' && !isRtl) {
      setIsRtl(true)
    } 
    if (lang !== 'ar' && isRtl) {
      setIsRtl(false)
    }
    // Load Language in frontend
    i18n.changeLanguage(lang)
    // try {
    //   await axiosAPI.post('/users/change_language', {lang})
    // } catch (error) {
    //   console.error(error)
    // }
    dispatch(handleAuthUserLanguage({language: lang}))
  }

  return (
    <UncontrolledDropdown href='/' tag='li' className='dropdown-language nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link' onClick={e => e.preventDefault()}>
        <ReactCountryFlag
          svg
          className='country-flag flag-icon'
          countryCode={i18n.language === 'ar' ? 'dz' : i18n.language}
        />
        <span className='selected-language'>{langObj[i18n.language]}</span>
      </DropdownToggle>
      <DropdownMenu className='mt-0' end>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'fr')}>
          <ReactCountryFlag className='country-flag' countryCode='fr' svg />
          <span className='ms-1'>Français</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'ar')}>
          <ReactCountryFlag className='country-flag' countryCode='dz' svg />
          <span className='ms-1'>العربية</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
