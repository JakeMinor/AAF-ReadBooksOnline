import { extend, setInteractionMode } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'

setInteractionMode('lazy')

/**
 * Add required validation to Vee-Validate.
 */
extend('required', {
  ...required,
  message: (fieldName) => {
    return `${fieldName} is required.`
  }
})

/**
 * Add email validation to Vee-Validate.
 */
extend('email', email)
