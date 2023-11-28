/*eslint-disable*/
import React from 'react'
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, UncontrolledTooltip } from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux'
import { handleUsersColumnsVisibilitiesUpdates } from './store'
import { translateAttribute } from '@configs/i18n'
import { useTranslation } from 'react-i18next'

export default function UsersColumnsVisibilitiesModal({openModal, toggleModal}) {
    // ** Hooks
    const { t } = useTranslation()
    const dispatch = useDispatch()
    // ** State
    const columnsVisibilites = useSelector(store => store.users.columns_visibilities)
    const handleCheckboxUpdate = (key) => {
        const tmpObj = {}
        tmpObj[key] = {
            name: columnsVisibilites[key].name,
            arabic_name: columnsVisibilites[key].arabic_name,
            value: !columnsVisibilites[key].value
        }
        dispatch(handleUsersColumnsVisibilitiesUpdates(tmpObj))
    }

  return (
    <Modal
        isOpen={openModal}
        toggle={toggleModal}
        className='modal-dialog-centered modal-lg'
    >
    <ModalHeader className='bg-transparent' toggle={toggleModal}></ModalHeader>
        <ModalBody className='pb-5 px-sm-4 mx-50'>
            <div className='text-center mb-2'>
                <h1 className='mb-1'>{t("Afficher/Cacher des colonnes")}</h1>
                <p>{t("Cochez les cases si vous souhitez afficher les colonnes de tableaux.")}</p>
            </div>
            <div className='info-container'>
            <ul className='list-unstyled categories-list'>
            {/* <li>
                <div className='form-check'>
                    <Input type='checkbox' id={'all-checkbox'} defaultChecked={false} onChange={(e) => handleCheckboxUpdate(0)}/>
                    <Label className='form-check-label' for={'all-checkbox'} >
                        {t("Tout")}
                    </Label>
                </div>
            </li> */}
            { Object.keys(columnsVisibilites).map((key) => {
                return (<li key={key} className="form-check">
                    <Input type='checkbox' id={key} defaultChecked={!columnsVisibilites[key].value} onChange={() => handleCheckboxUpdate(key)}/>
                    <Label className='form-check-label' for={key} >
                        {translateAttribute(columnsVisibilites[key].name, columnsVisibilites[key].arabic_name)}
                    </Label>
                </li>
                )
            })}
            </ul>
            </div>
                    {/* buttons row */}
            <Col className='text-center' xs={12}>
              <Button type='reset' className='mt-2' color='secondary' outline onClick={toggleModal}>
                {t("Fermer")}
              </Button>
            </Col>
        </ModalBody>
    </Modal>
  )
}
