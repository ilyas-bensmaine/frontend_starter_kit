import React from 'react'
import Avatar from '@components/avatar'
import { Coffee, X } from 'react-feather'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export default function SuccessToast({ toa, name }) {
    const { t } = useTranslation()
  return (
    <div className='d-flex'>
        <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        </div>
        <div className='d-flex flex-column'>
            <div className='d-flex justify-content-between'>
                <h6>{name}</h6>
                <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(toa.id)} />
            </div>
            <span>{t('You have successfully logged in. Enjoy!')}</span>
        </div>
    </div>
  )
}
