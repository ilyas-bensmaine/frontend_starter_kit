import React, { Fragment, useEffect } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Row, Spinner } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
// ** Utils
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { mapSelectableData, translateAttribute } from '../../utility/Utils'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useGetSelectableWilayas } from '@src/api/SelectableDataAPI'
import { useUpdateUser } from '@src/api/users/UsersAPI'

const defaultValues = {
    name: '',
    email: '',
    wilaya: ''
}

export default function Account({selectedUser}) {
    // ** Hook
    const { t } = useTranslation()
    //** Form
    const FormSchema = yup.object().shape({
        name: yup.string().required(t('Name is required')),
        email: yup.string().email().required(t('Email is required')),
        wilaya: yup.object().shape({
            value: yup.string().required(t('Ce champ est obligatoire')),
            label: yup.string().required(),
        })
    })
    const {
        control,
        reset,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({ defaultValues, resolver: yupResolver(FormSchema) })
    // ** Queries
    const getSelectableWilayas = useGetSelectableWilayas()
    const updateUser = useUpdateUser()
    const wilayasQuery = useSWR(`/api/cities/wilayas`, getSelectableWilayas)   
    // ** Effect
    useEffect(() => {
        reset({
            name: selectedUser.name,
            email: selectedUser.email,
            wilaya: { value: selectedUser.wilaya?.id, label: translateAttribute(selectedUser.wilaya?.name, selectedUser.wilaya?.arabic_name)  }
        })
    }, [])
    // ** Mutations
    const updateUserMutation = useSWRMutation(`api/user/${selectedUser?.id}`, updateUser, {
        onSuccess: () => {
          toast.success(t('Enregistrement modifié avec succès !'))
        },
        onError: (error) => {
          if (error.response?.status === 422) {
            const validitionErrors = error.response.data.errors
            for (const key in validitionErrors) {
                setError(key, {
                  type: 'server',
                  message: validitionErrors[key]
                })
            }
          } else {
            toast.error(t("Quelque chose n'a pas fonctioné !"))
            throw error
          }
        }
    })
    //** Submit
    const onSubmit = async (formData) => {
        const data = {
            name: formData.name,
            email: formData.email, 
            wilaya: formData.wilaya.value, 
        }
        await updateUserMutation.trigger({
            id: selectedUser?.id,
            data
        })
    }    
    return (
        <Fragment>
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>{t('Informations sur le compte')}</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for={`name`}>
                                {t('Nom et Prénom')}
                                </Label>
                                <Controller
                                    control={control}
                                    id='name'
                                    name='name'
                                    render={({ field }) => (
                                        <Input invalid={errors.name && true} {...field} />
                                    )}
                                />
                                {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                            </Col>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for={`email`}>
                                {t('Email')}
                                </Label>
                                <Controller
                                    control={control}
                                    id='email'
                                    name='email'
                                    render={({ field }) => (
                                        <Input type='email' invalid={errors.email && true} {...field} />
                                    )}
                                />
                                {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                            </Col>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='wilaya'>{t('Wilaya')}</Label>
                                <Controller
                                    control={control}
                                    id='wilaya'
                                    name='wilaya'
                                    render={({ field }) => (
                                        <Select
                                            theme={selectThemeColors}
                                            className={classnames('react-select', { 'is-invalid': errors?.wilaya })}
                                            classNamePrefix='select'
                                            options={mapSelectableData(wilayasQuery?.data)}
                                            isClearable={false}
                                            isLoading={wilayasQuery?.isLoading}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.wilaya?.value && <FormFeedback>{errors.wilaya?.value.message}</FormFeedback>}
                            </Col>
                            <Col xs={12}>
                                <Button type='submit' color='primary' disabled={updateUserMutation?.isMutating}>
                                    { updateUserMutation?.isMutating ? <Spinner color='light' size='sm' /> : t("Sauvgarder") }
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}
