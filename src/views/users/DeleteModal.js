// ** React Imports
import { Fragment, useContext } from 'react'

// ** Reactstrap Imports
import { Card, Row, Col, Modal, Input, Label, Button, ModalBody, ModalHeader, FormFeedback, Spinner } from 'reactstrap'
// ** Third Party Components
import toast from 'react-hot-toast'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
// ** Utils
import useSWRMutation from 'swr/mutation'
import { useTranslation } from 'react-i18next'
import { ThemeColors } from '@utility/context/ThemeColors'
import { useSelector } from 'react-redux'
import { useDeleteUser } from '@src/api/users/UsersAPI'

export default function UsersDeleteModal({id, openModal, toggleModal}) {
  // ** stores
  const sortParams = useSelector((state) => state?.users?.sortParams)
  const filterParams = useSelector((state) => state?.users?.filterParams)
  // ** Context
  const { colors } = useContext(ThemeColors)
  // ** Hook
  const { t } = useTranslation()
  // ** Queries
  const deleteUser = useDeleteUser()
  const deleteUserMutation = useSWRMutation(['users', sortParams, filterParams], deleteUser, {
    onSuccess: () => {
      toast.success(t('Enregistrement supprimé avec succès !'), {iconTheme: {primary: colors.warning.main}})
      toggleModal()
    }, 
    onError: (error) => {
      toast.error(t("Quelque chose n'a pas fonctioné !"))
      throw error
    }
  })
  // ** Submit
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await deleteUserMutation.trigger({id})
    } catch (error) {
      console.log(error)
    }
  }

  const handleModalClosed = () => {
    //
  }
  return (
    <Fragment>
      <Modal isOpen={openModal} toggle={toggleModal} onClosed={handleModalClosed} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={toggleModal}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>{t("Supprimer un enregistrement")}</h1>
            <p>{t("Êtes-vous sur de vouloir supprimer cet enregistrement ?")}</p>
          </div>
          <Row className='gy-1 pt-75'>
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button onClick={(e) => onSubmit(e)} className='me-1' color='warning' disabled={deleteUserMutation.isMutating}>
                { deleteUserMutation.isMutating ? <Spinner color='light' size='sm' /> : t("Supprimer") }
              </Button>
              <Button type='reset' color='secondary' outline onClick={toggleModal}>
                {t("Annuler")}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}
