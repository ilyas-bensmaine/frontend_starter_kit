// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col, Label, Card, CardBody, Badge, Progress, Button, Modal, ModalBody, ModalHeader, Input, Form, FormFeedback, Alert } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import * as yup from 'yup'
// import Select from 'react-select'
import withReactContent from 'sweetalert2-react-content'

// ** Utils
// import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateUserData } from '../../../redux/authentication'
import ComponentSpinner from '../../@core/components/spinner/Loading-spinner'
import { useTranslation } from 'react-i18next'
import { days_between } from '../../utility/Utils'
import useAxiosAPI from '../../api/useAxiosAPI'
import { getUserLanguage } from '../../configs/i18n'

const MySwal = withReactContent(Swal)

const PlanCard = ({ selectedUser }) => {
  // ** Hook
  const axiosInstance = useAxiosAPI()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  // ** State
  const [show, setShow] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  // ** Consts
  const subscription = selectedUser?.subscription
  const remainingDays = (days_between(new Date().toLocaleDateString(), selectedUser?.subscription?.expired_at))
  
  // ** Effect
  useEffect(() => {
    setIsLoading(true)
    const loadCurrentPlan = async () => {
        try {
            const response = await axiosInstance.get('/api/users/subscription')
            setCurrentPlan(response.data)
          } catch (error) {
            console.log(error)
          }
        setIsLoading(false)
    }

  loadCurrentPlan()
}, [selectedUser])

 // **Form
 const SignupSchema = yup.object().shape({
  code: yup.string('Format non valide').required(t(''))
            .matches(/^([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])$/, 'Le code dois contenir 10 chiffres')
            
 })
 const {
  control,
  setError,
  handleSubmit,
  formState: { errors }
} = useForm({   
  resolver: yupResolver(SignupSchema)
})
const onSubmit = async (formData) => {
  const data = {
    code: formData.code
  }
  try {
    const response  = await axiosInstance.post('/api/cards/use', data)
    dispatch(updateUserData({ dataToUpdate: []}))
    MySwal.fire({
      icon: 'success',
      title: t('Jolie'),
      text: response?.data.message,
      customClass: {
        confirmButton: 'btn btn-success'
      }
    })
    setShow(!show)
  } catch (error) {
    if (error.response?.status !== 200) {
      console.log(error.response.data.message)
      const validitionErrors = error.response.data.message
          setError('code', {
            type: 'server',
            message: validitionErrors
          })
      }
    } 
  
}
const onError = errors => {
  console.log(errors)
}

const handleSubscription = () => {
  if (selectedUser) {
    setShow(true)
  } else {
    MySwal.fire({
      icon: 'info',
      // title: t("Vous devez vous se connecter d'abord"),
      text: t("Vous devez vous connecter d'abord"),
      showCancelButton: true,
      cancelButtonText: t("S'inscrire"),
      confirmButtonText: t('Se connecter'),
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-outline-success ms-1'
      }
    }).then(function (result) {
      if (result.value) {
        navigate('/login')
      } else {
        navigate('/register')
      }
    })
  }
}
  return (
    <Fragment>
       <Card className='plan-card border-primary'>
         {isLoading ? <ComponentSpinner /> : <CardBody>
         {subscription && <div>
          <div className='d-flex justify-content-between align-items-start'>
            <h1><Badge aria-setsize={50} color='light-primary'>{currentPlan?.plan.name}</Badge></h1>
            <div className='d-flex justify-content-center'>
              <sup className='h5 pricing-currency text-primary mt-1 mb-0'>DZD</sup>
              <span className='fw-bolder display-5 mb-0 text-primary'>{currentPlan?.plan.price}</span>
              <sub className='pricing-duration font-small-4 ms-25 mt-auto mb-2'>/{currentPlan?.plan.periodicity_type}</sub>
            </div>
          </div>
          <ul className='ps-1 mb-2'>
            {currentPlan?.features.map((item) => {
              return (
              <li className='mb-50'>{item.description}{ item.consumable ? ` : ${Math.floor(item.balance)}/${Math.floor(item.pivot.charges)}` : null} {t(item.periodicity_type)}</li>
              )
            })
            }
          </ul>
          <div className='d-flex justify-content-between align-items-center fw-bolder mb-50'>
            <span>{t('Jours')}</span>
            
            {/* <span>{subscription?.expired_at}</span> */}
            <span>{new Date(subscription?.expired_at).toLocaleDateString(getUserLanguage()) }</span>
          </div>
          <Progress className='mb-50' value={100 - Math.floor(remainingDays * 100 / subscription?.period)} style={{ height: '8px' }} />
          <span>{remainingDays} {t('Jours restants')} </span>
          </div>}
          <div className='d-grid w-100 mt-2'>
            <Button color='primary' onClick={() => handleSubscription()}>
              {t("S'abonner à un plan")}
            </Button>
          </div>
        </CardBody> }
      </Card>

      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-5 pb-2'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>{subscription ? t("S'abonner à un autre plan") : t("S'abonner à un plan")  }</h1>
            <p>{t("Vous pouver renouvler le plan acturel ou s'abonner à un nouveau plan")}</p>
           {subscription &&  <Alert color='warning' className='mb-2'>
                                <div className='alert-body'> {t("Votre plan actuel sera perdu")} </div>
                              </Alert>}
          </div>
          <Row className='pt-50'>
            <Form  onSubmit={handleSubmit(onSubmit, onError)}>
            <Col className='mb-1'>
            <Label className='form-label' for='code'>
            {t('Insérer le Code composé de 10 chiffres')}
            </Label>
            <Controller
              id='code'
              name='code'
              control={control}
              render={({ field }) => <Input placeholder='0123456789' invalid={errors.code && true} {...field} />}
            />
            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
          </Col>
            <Col  className='text-sm-end mt-2'>
              <Button color='primary' onClick={handleSubmit(onSubmit)}>{t("S'abonner")}</Button>
            </Col>
            </Form>
          </Row>
        </ModalBody>
        
       {subscription &&  (<> <hr/>
        <ModalBody className='px-5 pb-3'>
          <h6>{t('Votre abonnement actuel est : ')} {currentPlan?.plan.name}</h6>
          <div className='d-flex justify-content-between align-items-center flex-wrap'>
            <div className='d-flex justify-content-center me-1 mb-1'>
              <sup className='h5 pricing-currency pt-1 text-primary'>DZD</sup>
              <h1 className='fw-bolder display-4 mb-0 text-primary me-25'> {currentPlan?.plan.price}</h1>
              <sub className='pricing-duration font-small-4 mt-auto mb-2'>/{t(currentPlan?.plan.periodicity_type)}</sub>
            </div>
          </div>
        </ModalBody>
       </>)}
      </Modal>
    </Fragment>
  )
}

export default PlanCard
