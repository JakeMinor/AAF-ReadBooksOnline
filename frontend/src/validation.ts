import { extend, setInteractionMode } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'

setInteractionMode('lazy')

extend('required', {
  ...required,
  message: (fieldName) => {
    return `${fieldName} is required.`
  }
})
extend('email', email)
