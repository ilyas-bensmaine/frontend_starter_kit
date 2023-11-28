// ** React Imports
import { Fragment, Suspense, lazy, useState } from 'react'

// ** Third Party Components
import { ChevronDown, File, Grid } from 'react-feather'
import { useTranslation } from 'react-i18next'
import DataTable from 'react-data-table-component'
// ** Reactstrap Imports
import { Card, Input, Label, Row, Col, CardBody, CardHeader, CardTitle, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Spinner } from 'reactstrap'
import ProgressComponent from '@myComponents/dataTablesAdds/ProgressComponent'
import NoDataComponent from '@myComponents/dataTablesAdds/NoDataComponent'
import Columns from './Columns'
import { useDispatch, useSelector } from 'react-redux'
import { handleUsersFilterParamsUpdates, handleUsersSortParamsUpdates } from './store'
import useSWR from 'swr'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useGetUsers } from '@src/api/users/UsersAPI'
// ** lazy
const FormModal = lazy(() => import('./FormModal'))
const DeleteModal = lazy(() => import('./DeleteModal'))
const DetailModal = lazy(() => import('./DetailModal'))
const ColumnsVisibilitiesModal = lazy(() => import('./VisibilitiesModal'))
const FilterModal = lazy(() => import('./FilterModal'))

  const UsersList = () => {
  // ** stores
  const sortParams = useSelector((state) => state?.users?.sortParams)
  const filterParams = useSelector((state) => state?.users?.filterParams)
  // ** State
  const [formAction, setFormAction] = useState('')
  const [selectedRecordId, setSelectedRecordId] = useState(null)
  const [openFormModal, setOpenFormModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openColumnsVisibilitiesModal, setOpenColumnsVisibilitiesModal] = useState(false)
  const [openFilterModal, setOpenFilterModal] = useState(false)
  // ** Hooks
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const getUsers = useGetUsers()
  const { isLoading, data } = useSWR(['users', sortParams, filterParams], () => getUsers(sortParams, filterParams))
  // ** Toggles
  const toggleFormModal = () => {
    setOpenFormModal(prevState => !prevState)
  }
  const toggleDetailModal = (id) => {
    setSelectedRecordId(id)
    setOpenDetailModal(prevState => !prevState)
  }
  const toggleDeleteModal = (id) => {
    setSelectedRecordId(id)
    setOpenDeleteModal(prevState => !prevState)
  }
  const toggleColumnsVisibilitiesModal = () => setOpenColumnsVisibilitiesModal(prevState => !prevState)
  const toggleFilterModal = () => setOpenFilterModal(prevState => !prevState)
  // ** Functions
  const handleAddAction = () => {
    setFormAction('add')
    setSelectedRecordId(null)
    toggleFormModal()
  }
  const handleUpdateAction = (id) => {
    setFormAction('update')
    setSelectedRecordId(id)
    toggleFormModal()
  }
  const downloadExcel = () => {

  }
  const handlePageCahnge = (page) => {
    dispatch(handleUsersSortParamsUpdates({page}))
  }
  const handleRowsPerPageCahnge = (newRowsPerPage) => {
    dispatch(handleUsersSortParamsUpdates({perPage: newRowsPerPage}))
  }
  const handleSort = (column, sortDirection) => {
    if (sortDirection === 'asc') {
      dispatch(handleUsersSortParamsUpdates({sort: `${column.sortField}`}))
    } else {
      dispatch(handleUsersSortParamsUpdates({sort: `-${column.sortField}`}))
    }
  }
  return (
    <Fragment>
        <Card>
            <CardHeader>
                <CardTitle tag='h4'>{t("Actions")}</CardTitle>
            </CardHeader>
            <CardBody className='d-flex align-items-center'>
              <Col md={9} className='d-flex align-items-center justify-content-start'>
                <Button className='me-1' color='success' onClick={handleAddAction}>
                    <span className='align-middle me-50'>{t("Ajouter")}</span>
                </Button>
                <Button className='me-1' outline color='secondary' onClick={toggleColumnsVisibilitiesModal}>
                  <span className='align-middle'>{t("Afficher")}</span>
                </Button>
                <UncontrolledDropdown className='me-1'>
                  <DropdownToggle color='secondary' caret outline>
                      <span className='align-middle'>{ t("Exporter")}</span>
                  </DropdownToggle>
                  <DropdownMenu>
                      <DropdownItem className='w-100'>
                          <Grid className='font-small-4 me-50' onClick={downloadExcel}/>
                          <span className='align-middle'>Excel</span>
                      </DropdownItem>
                      <DropdownItem className='w-100'>
                          <File className='font-small-4 me-50' onClick={downloadExcel}/>
                          <span className='align-middle'>PDF</span>
                      </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
              <Col md={3} className='d-flex align-items-center justify-content-end'>
                <Button className='me-1' color='primary' onClick={toggleFilterModal}>
                    <span className='align-middle me-50'>{t("Filtre")}</span>
                </Button>
              </Col>
            </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle tag='h4'>{t("Liste des utilisateurs")}</CardTitle>
          </CardHeader>
          <CardBody>
            <Row className='justify-content-end mx-0'>
              <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
                <Label className='me-1' for='search-input-1'>
                  {t('Rechercher')}
                </Label>
                <Input
                  className='dataTable-filter mb-50'
                  type='text'
                  bsSize='sm'
                  id='search-input-1'
                  value={filterParams.searchTerm}
                  onChange={(e) => dispatch(handleUsersFilterParamsUpdates({searchTerm: e.target.value}))}
                />
              </Col>
            </Row>
            <div className='react-dataTable'>
              <DataTable
                noHeader
                progressPending={isLoading}
                progressComponent={<ProgressComponent />}
                noDataComponent={<NoDataComponent />}
                selectableRowsNoSelectAll
                columns={Columns({searchTerm: filterParams.searchTerm, handleUpdateAction, toggleDetailModal,toggleDeleteModal})}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                data={data?.data}
                pagination
                paginationServer
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationTotalRows={data?.meta?.total}
                paginationDefaultPage={data?.meta?.current_page}
                paginationPerPage={data?.meta?.per_page}
                paginationComponentOptions={{
                  rowsPerPageText: t("Enregistrements par page :"),
                  rangeSeparatorText: t("de")
                }}
                onSort={handleSort}
                onChangePage={handlePageCahnge}
                onChangeRowsPerPage={handleRowsPerPageCahnge}
              />
            </div>
          </CardBody>
        </Card>
        <Suspense fallback={null}>
          {openFormModal ? <FormModal id={selectedRecordId} formAction={formAction} openModal={openFormModal} toggleModal={toggleFormModal}/> : null}
          {openDetailModal ? <DetailModal id={selectedRecordId} openModal={openDetailModal} toggleModal={toggleDetailModal}/> : null}
          {openDeleteModal ? <DeleteModal id={selectedRecordId} openModal={openDeleteModal} toggleModal={toggleDeleteModal}/> : null}
          {openColumnsVisibilitiesModal ? <ColumnsVisibilitiesModal openModal={openColumnsVisibilitiesModal} toggleModal={toggleColumnsVisibilitiesModal}/> : null}
          {openFilterModal ? <FilterModal openModal={openFilterModal} toggleModal={toggleFilterModal}/> : null}
        </Suspense>
    </Fragment>
  )
}

export default UsersList
