import React from 'react'
import { useTranslation } from 'react-i18next'

export default function NoDataComponent() {
  const { t } = useTranslation()

  return (
    <div className='p-4'>
        <span>
            {t("Il n'y a pas d'eneregistrements à afficher")}
        </span>
    </div>
  )
}
