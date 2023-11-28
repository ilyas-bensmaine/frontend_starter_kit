import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { translateAttribute } from '@configs/i18n'

export const usersDefaultValues = (selectedRecord) => {
    return {
        name: selectedRecord ? selectedRecord?.name : '',
        arabic_name: selectedRecord ? selectedRecord?.arabic_name : '',
        email: selectedRecord ? selectedRecord?.email : '',
        phone: selectedRecord ? selectedRecord?.phone?.substring(4) : '',
        profession: selectedRecord ? {
            value: selectedRecord?.profession?.id,
            label: translateAttribute(selectedRecord?.profession?.name, selectedRecord?.profession?.arabic_name)
        } : null,
        status: selectedRecord ? {
            value: selectedRecord?.status?.id,
            label: translateAttribute(selectedRecord?.status?.name, selectedRecord?.status?.arabic_name)
        } : null,
        wilaya: selectedRecord ? {
            value: selectedRecord?.wilaya?.id,
            label: translateAttribute(selectedRecord?.wilaya?.name, selectedRecord?.wilaya?.arabic_name)
        } : null
    }
}

export const usersValidationSchema = () => {
    // ** Hook
    const { t } = useTranslation()

    return yup.object().shape({
        name: yup.string().required(t("Ce champ est obligatoire")),
        arabic_name: yup.string().required(t("Ce champ est obligatoire")),
        email: yup.string()
                .email(t('Ce champ doit être un email valide'))
                .required(t("Ce champ est obligatoire")),
        phone: yup.string()
                .required(t('Ce champ est obligatoire'))
                .matches(/^((5|6|7)[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])$/, 'Format invalide pour le numéro de téléphone'),
        profession: yup.object().shape({
            label: yup.string().required(t("Ce champ est obligatoire")),
            value: yup.string().required(t("Ce champ est obligatoire"))
        }).nullable().required(t("Ce champ est obligatoire")),
        status: yup.object().shape({
            label: yup.string().required(t("Ce champ est obligatoire")),
            value: yup.string().required(t("Ce champ est obligatoire"))
        }).nullable().required(t("Ce champ est obligatoire")),
        wilaya: yup.object().shape({
            label: yup.string().required(t("Ce champ est obligatoire")),
            value: yup.string().required(t("Ce champ est obligatoire"))
        }).nullable().required(t("Ce champ est obligatoire"))
    })
}
