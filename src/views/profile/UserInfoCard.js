// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Button, Badge } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import { Check, Briefcase, X } from 'react-feather'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { useTranslation } from 'react-i18next'
import { translateAttribute } from '../../utility/Utils'

const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedUser }) => {
  // ** Hooks
  const { t } = useTranslation()
  // ** render user img
  const renderUserImg = () => {
    if (selectedUser !== null && selectedUser.avatar?.length) {
      return (
        <img
          height='110'
          width='110'
          alt='user-avatar'
          src={selectedUser.avatar}
          className='img-fluid rounded mt-3 mb-2'
        />
      )
    } else {
      return (
        <Avatar
          initials
          color={selectedUser.avatarColor || 'light-primary'}
          className='rounded mt-3 mb-2'
          content={selectedUser.name}
          contentStyles={{
            borderRadius: 0,
            fontSize: 'calc(48px)',
            width: '100%',
            height: '100%'
          }}
          style={{
            height: '110px',
            width: '110px'
          }}
        />
      )
    }
  }

  // const handleSuspendedClick = () => {
  //   return MySwal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert user!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, Suspend user!',
  //     customClass: {
  //       confirmButton: 'btn btn-primary',
  //       cancelButton: 'btn btn-outline-danger ms-1'
  //     },
  //     buttonsStyling: false
  //   }).then(function (result) {
  //     if (result.value) {
  //       MySwal.fire({
  //         icon: 'success',
  //         title: 'Suspended!',
  //         text: 'User has been suspended.',
  //         customClass: {
  //           confirmButton: 'btn btn-success'
  //         }
  //       })
  //     } else if (result.dismiss === MySwal.DismissReason.cancel) {
  //       MySwal.fire({
  //         title: 'Cancelled',
  //         text: 'Cancelled Suspension :)',
  //         icon: 'error',
  //         customClass: {
  //           confirmButton: 'btn btn-success'
  //         }
  //       })
  //     }
  //   })
  // }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>
              {renderUserImg()}
              <div className='d-flex flex-column align-items-center text-center'>
                <div className='user-info'>
                  <h4>{selectedUser !== null ? selectedUser.name : 'Eleanor Aguilar'}</h4>
                  {selectedUser !== null ? (
                    <Badge color='light-warning' className='text-capitalize'>
                      { translateAttribute(selectedUser.user_profession?.name, selectedUser.user_profession?.arabic_name) }
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-around my-2 pt-75'>
            <div className='d-flex align-items-start me-2'>
              <Badge color='light-primary' className='rounded p-75'>
                <Check className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>{selectedUser.posts_count}</h4>
                <small> {t('Demandes')} </small>
              </div>
            </div>
            <div className='d-flex align-items-start'>
              <Badge color='light-primary' className='rounded p-75'>
                <Briefcase className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>{selectedUser.post_responses_count}</h4>
                <small>{t('Réponses')}</small>
              </div>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>{t('Détails')}</h4>
          <div className='info-container'>
            {selectedUser !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>{t('Nom et Prénom')} :</span>
                  <span>{selectedUser.name}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>{t('Email')} :</span>
                  <span>{selectedUser.email}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>{t('Etat')} :</span>
                  <Badge className='text-capitalize' color={selectedUser.user_status?.color_tag}>
                    { translateAttribute(selectedUser.user_status?.name, selectedUser.user_status?.arabic_name) }
                  </Badge>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'> {t('Spécialité')} :</span>
                  <span className='text-capitalize'>
                    { translateAttribute(selectedUser.user_profession?.name, selectedUser.user_profession?.arabic_name) }
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'> {t('Numéro de téléphone')} : </span>
                  <span>{selectedUser.phone}</span>
                </li>
                {/* <li className='mb-75'>
                  <span className='fw-bolder me-25'>Tel:</span>
                  <span>Tax-{selectedUser.contact}</span>
                </li> */}
                <li className='mb-75'>
                  <span className='fw-bolder me-25'> {t('Wilaya')} : </span>
                  <span className='text-capitalize'>
                    { translateAttribute(selectedUser.wilaya?.name, selectedUser.wilaya?.arabic_name) }
                  </span>                
                </li>
              </ul>
            ) : null}
          </div>
         
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
