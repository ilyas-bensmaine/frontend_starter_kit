import { Ability } from '@casl/ability'
import { initialAbility } from './initialAbility'

const userData = JSON.parse(localStorage.getItem('userData'))
const existingAbility = userData ? userData?.permissions?.map((item) => {
    const arr = item.name.split('@')
    return {action: arr[1], subject: arr[0]} 
  }) : null

export default new Ability(existingAbility || initialAbility)
