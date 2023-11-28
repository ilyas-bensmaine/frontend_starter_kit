import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Label } from 'reactstrap'

export default function BooleanFieldsComponent({radioboxName, filterValues, handleUpdates}) {
    // ** Hooks
    const { t } = useTranslation()

  return <Fragment>
    <div className='d-flex justify-content align-items mt-25 mx-25'>
        <div className='form-check me-2'>
            <Input 
                type='radio'
                name={radioboxName} 
                id={`${radioboxName}-yes`}
                value={true}
                defaultChecked={filterValues}
                onChange={handleUpdates}
            />
            <Label className='form-check-label' for={`${radioboxName}-yes`}>
                {t("Oui")}
            </Label>
        </div>
        <div className='form-check me-2'>
            <Input 
                type='radio' name={radioboxName} 
                id={`${radioboxName}-no`} 
                value={false} 
                defaultChecked={!filterValues} 
                onChange={handleUpdates}
            />
            <Label className='form-check-label' for={`${radioboxName}-no`}>
                {t("Non")}
            </Label>
        </div>
        <div className='form-check me-2'>
            <Input 
                type='radio' 
                name={radioboxName} 
                id={`${radioboxName}-all`} 
                value={''} 
                defaultChecked={filterValues === ''}
                onChange={handleUpdates}
            />
            <Label className='form-check-label' for={`${radioboxName}-all`}>
                {t("Tout")}
            </Label>
        </div>
    </div>
  </Fragment>
}
