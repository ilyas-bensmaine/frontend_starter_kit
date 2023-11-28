import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader, Row } from 'reactstrap'
import SelectWithCheckboxComponent from '@myComponents/filters/SelectWithCheckboxComponent'
import useSWR from 'swr'
import { useDispatch, useSelector } from 'react-redux'
import { handleUsersFilterParamsCleared, handleUsersFilterParamsUpdates } from './store'
import { useGetSelectablePlans, useGetSelectableUserProfessions, useGetSelectableUserStatuses, useGetSelectableWilayas } from '@src/api/SelectableDataAPI'

export default function UsersFilterModal({openModal, toggleModal}) {
    // ** Store
    const filterParams = useSelector((state) => state?.users?.filterParams)
    const dispatch = useDispatch()
    // ** Hooks
    const { t } = useTranslation()
    // ** Queries
    const getSelectableWilayas = useGetSelectableWilayas()
    const getSelectableUserProfessions = useGetSelectableUserProfessions()
    const getSelectablePlans = useGetSelectablePlans()
    const getSelectableUserStatuses = useGetSelectableUserStatuses()
    const wilayasQuery = useSWR('selectable_user_wilayas', getSelectableWilayas)
    const professionsQuery = useSWR('selectable_user_professions', getSelectableUserProfessions)
    const plansQuery = useSWR('selectable_plans', getSelectablePlans)
    const statusesQuery = useSWR('selectable_user_statuses', getSelectableUserStatuses)
    // ** Functions
    const applayFilter = (e) => {
        e.prenventDefault()
        toggleModal()
    }
    const clearFilter = (e) => {
        e.prenventDefault()
        dispatch(handleUsersFilterParamsCleared())
    }
    // ** Handle functions
    const handleWilayasUpdates = (values) => {
        dispatch(handleUsersFilterParamsUpdates({wilaya: values.map((item) => { 
            return JSON.stringify(item.value) }).join(",")
        }))
    }   
    const handleProfessionsUpdates = (values) => {
        dispatch(handleUsersFilterParamsUpdates({profession: values.map((item) => { 
            return JSON.stringify(item.value) }).join(",")
        }))
    }  
    const handlePlansUpdates = (values) => {
        dispatch(handleUsersFilterParamsUpdates({plans: values.map((item) => { 
            return JSON.stringify(item.value) }).join(",")
        }))
    }    
    const handleStatusesUpdates = (values) => {
        dispatch(handleUsersFilterParamsUpdates({status: values.map((item) => { 
            return JSON.stringify(item.value) }).join(",")
        }))
    }
    return (
        <Offcanvas
            scrollable={false}
            backdrop={true}
            direction='end'
            isOpen={openModal}
            toggle={toggleModal}
        >
            <OffcanvasHeader toggle={toggleModal}>{t('Filtre')}</OffcanvasHeader>
            <OffcanvasBody className='px-2'>
                <Row md={12} className='mb-2'>
                    <div className='d-flex align-items-center justify-content-end w-100'>
                        <Button block color='success' onClick={(e) => applayFilter(e)} className='me-1'>
                            {t('Appliquer')}
                        </Button>
                        <Button block outline color='secondary' onClick={(e) => clearFilter(e)}>
                            {t('Effacer')}
                        </Button>
                    </div>
                </Row>
                <div className='mb-2'>
                    <h6 className='filter-title'>{t("Wilayas")}</h6>
                    <SelectWithCheckboxComponent optionsQuery={wilayasQuery} filterValues={filterParams.wilaya} handleFilterParamsUpdates={handleWilayasUpdates}
                    />
                </div>
                <div className='mb-2'>
                    <h6 className='filter-title'>{t("Professions")}</h6>
                    <SelectWithCheckboxComponent optionsQuery={professionsQuery} filterValues={filterParams.profession} handleFilterParamsUpdates={handleProfessionsUpdates}
                    />
                </div>
                <div className='mb-2'>
                    <h6 className='filter-title'>{t("Abonnements")}</h6>
                    <SelectWithCheckboxComponent optionsQuery={plansQuery} filterValues={filterParams.plan} handleFilterParamsUpdates={handlePlansUpdates}
                    />
                </div>
                <div className='mb-2'>
                    <h6 className='filter-title'>{t("Etats")}</h6>
                    <SelectWithCheckboxComponent maxCheckedOptions={1} optionsQuery={statusesQuery} filterValues={filterParams.status} handleFilterParamsUpdates={handleStatusesUpdates}/>
                </div>
            </OffcanvasBody>
        </Offcanvas>
    )
}
