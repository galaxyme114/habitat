import { configure, extend } from 'vee-validate'
import {
  required,
  email,
  min
  // max_value,
  // min_value
} from 'vee-validate/dist/rules'
import api from '@/api'

/*
 * Configure Vee Validate
 */
const config = {
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  },
  bails: false,
  skipOptional: true,
  mode: 'aggressive',
  useConstraintAttrs: true
}
configure(config)

/*
 * Import the validators
 */
extend('required', {
  ...required,
  message: 'The {_field_} field is required'
})
extend('email', {
  ...email,
  message: 'A valid email address is required'
})
extend('min', {
  ...min,
  message: 'The {_field_} must be at least {length} characters'
})
// extend('max_value', max_value)
// extend('min_value', min_value)

extend('api_validate_email', {
  async validate (email, params: { [id: string]: any }) {
    if (!email || email.length < 4) {
      return false
    }
    try {
      const { data } = await api.validation.email(email, params.id)
      return data.valid
    } catch (e) {
      return false
    }
  },
  params: ['id'],
  message: 'This email address is not available.'
})

extend('select_required', {
  message: 'The {_field_} field is required',
  validate: value => !!value.value
})
