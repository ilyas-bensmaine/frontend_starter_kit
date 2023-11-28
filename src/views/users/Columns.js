import React, { useContext } from 'react'
import { Edit3, FileText, Lock, Trash, Users } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Badge, Button, Spinner, UncontrolledTooltip } from 'reactstrap'
import { getUserLanguage, translateAttribute } from '@configs/i18n'
import Highlighter from 'react-highlight-words'

// ** Context
import { ThemeColors } from '@utility/context/ThemeColors'
import { useSelector } from 'react-redux'

export default function UsersColumns({searchTerm, handleUpdateAction, toggleDetailModal, toggleDeleteModal}) {
    const columnsVisibilites = useSelector(state => state.users.columns_visibilities)
    const { t } = useTranslation()
    const { colors } = useContext(ThemeColors)
  return [
        {
            name: t('Nom et Prénom'),
            sortable: true,
            sortField: getUserLanguage() === 'fr' ? 'name' : 'arabic_name',
            omit: columnsVisibilites.name?.value,
            selector: row => <span className='text-capitalize'>
                        <Highlighter
                          searchWords={[searchTerm]}
                          autoEscape={true}
                          textToHighlight={translateAttribute(row.name, row.arabic_name)}
                        />
                      </span>
        },
        {
            name: t("Email"),
            sortable: true,
            sortField: 'email',
            omit: columnsVisibilites.email?.value,
            selector: row => <span>
                        <Highlighter
                          searchWords={[searchTerm]}
                          autoEscape={true}
                          textToHighlight={row.email}
                        />
                      </span>
        },
        {
            name: t("Phone"),
            omit: columnsVisibilites.phone?.value,
            selector: row => <span dir='ltr'>
                {row.phone}
            </span>
        },        
        {
            name: t("Wilaya"),
            sortable: true,
            sortField: 'wilaya',
            omit: columnsVisibilites.wilaya?.value,
            selector: row => <span>
                {translateAttribute(row?.wilaya?.name, row?.wilaya?.arabic_name)}
            </span>
        },
        {
            name: t("Profession"),
            omit: columnsVisibilites.profession?.value,
            selector: row => <span className='text-capitalize'>
                <Badge color={row?.profession?.tag_color}>
                    {translateAttribute(row?.profession?.name, row?.profession?.arabic_name)}
                </Badge>
            </span>
        },
        {
            name: t("Abonnement actuel"),
            omit: columnsVisibilites.plan?.value,
            selector: row => <span className='text-capitalize'>
                <Badge color={row?.subscription?.plan?.tag_color}>
                    {translateAttribute(row?.subscription?.plan?.name, row?.subscription?.plan?.arabic_name)}
                </Badge>
            </span>
        },
        {
            name: t("Etat"),
            omit: columnsVisibilites.status?.value,
            selector: row => <span className='text-capitalize'> 
                <Badge color={row?.status?.tag_color}>{translateAttribute(row?.status?.name, row?.status?.arabic_name)}</Badge>
            </span>
        },
        {
            omit: columnsVisibilites.actions?.value,
            allowOverflow: true,
            selector: row => {
                return (
                    <div className='d-flex'>
                        <Button.Ripple id={`edit-tooltip-${row.id}`} className='btn-icon rounded-circle' color='flat' size='sm' onClick={(e) => {
                            e.preventDefault()
                            handleUpdateAction(row.id)
                        }}>
                            <Edit3 size={16} color={colors.primary.main}/>
                        </Button.Ripple>
                        <UncontrolledTooltip placement='top' target={`edit-tooltip-${row.id}`}>
                            {t("Modifier")}
                        </UncontrolledTooltip>
                        <Button.Ripple id={`details-tooltip-${row.id}`} className='btn-icon rounded-circle' color='flat' size='sm' onClick={(e) => {
                            e.preventDefault()
                            toggleDetailModal(row.id)
                        }}>
                            <FileText size={16}/>
                        </Button.Ripple>
                        <UncontrolledTooltip placement='top' target={`details-tooltip-${row.id}`}>
                            {t("Détails")}
                        </UncontrolledTooltip>
                        <Button.Ripple id={`delete-tooltip-${row.id}`} className='btn-icon rounded-circle' color='flat' size='sm' onClick={(e) => {
                            e.preventDefault()
                            toggleDeleteModal(row.id)
                        }}>
                            <Trash size={16} color={colors.warning.main}/>
                        </Button.Ripple>
                        <UncontrolledTooltip placement='top' target={`delete-tooltip-${row.id}`}>
                            {t("Supprimer")}
                        </UncontrolledTooltip>
                        
                    </div>
                )
        }
        }
    ] 
}
