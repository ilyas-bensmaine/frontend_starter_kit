import React, { Fragment, useState, useEffect } from 'react'
import classnames from 'classnames'
import { Input, Label } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { mapSelectableData } from '../../utility/Utils'
import { useTranslation } from 'react-i18next'

export default function SelectWithCheckboxComponent({ maxCheckedOptions, optionsQuery, filterValues, handleFilterParamsUpdates }) {
  // ** Hooks
  const { t } = useTranslation()
  // ** State
  const [selectedItems, setSelectedItems] = useState([])
  useEffect(() => {
    const filterArray = filterValues ? filterValues.split(',').map(Number) : []
    setSelectedItems(mapSelectableData(optionsQuery?.data?.filter((item) => filterArray.includes(item.id))))
  }, [filterValues])
  // ** Loops through Checked ItemsFilter
  const handleCheckboxUpdate = (e, item) => {
    setSelectedItems((prevState) => {
      const newState = prevState.filter((selectedItem) => { return selectedItem !== item })
      handleFilterParamsUpdates(newState)
      return newState
    })
  }

  const handleChanges = (values) => {
      setSelectedItems(values)
      handleFilterParamsUpdates(values)
    }


    const renderCheckedItems = () => {
        if (selectedItems?.length) {
            return (
                selectedItems?.map(item => {
                    return (
                    <li key={item.label}>
                        <div className='form-check'>
                            <Input type='checkbox' id={item.label} defaultChecked={true} onChange={(e) => handleCheckboxUpdate(e, item)}/>
                            <Label className='form-check-label' for={item.label} >
                                {item.label}
                            </Label>
                        </div>
                        {/* <span>{item.total}</span> */}
                    </li>
                    )
                }).slice(0, maxCheckedOptions)
            )
        } else {
        return null
        }
    }

  return (
    <Fragment>
        <Select
            placeholder={t("Choisir une valeur...")}
            isClearable={false}
            isMulti
            theme={selectThemeColors}
            className={classnames('react-select mb-1')}
            classNamePrefix='select'
            controlShouldRenderValue={false}
            onChange={handleChanges}
            value={selectedItems}
            options={mapSelectableData(optionsQuery?.data)}
            isOptionDisabled={() => selectedItems?.length >= (maxCheckedOptions ? maxCheckedOptions : 10)}
            isLoading={optionsQuery?.isLoading}
            isDisabled={optionsQuery?.isLoading}
        />
        <ul className='list-unstyled brand-list mx-1'>
            {renderCheckedItems()}
        </ul>
    </Fragment>
  )
}
