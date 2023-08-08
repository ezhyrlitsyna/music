import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
import {
  required,
  max,
  min,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('email', email)
    defineRule('min_value', minValue)
    defineRule('max_value', maxValue)
    defineRule('confirmed', confirmed)
    defineRule('excluded', excluded)
    configure({
      generateMessage: (ctx) => {

        const messages = {
          required: `The field ${ctx.field} is required`,
          email: `The field ${ctx.field} must be a valid email`,
          min: `The field ${ctx.field} is too short`,
          max: `The field ${ctx.field} is too long`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetic characters and spaces`,
          min_value: `The field ${ctx.field} is too low`,
          max_value: `The field ${ctx.field} is too high`,
          confirmed: `The field ${ctx.field} confirmation does not match`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}`
        }

        const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : 'Some rule'
        return message
      },
			validateOnBlur: true,
			validateOnChange: true,
			validateOnInput: false,
			validateOnModelUpdate: true,
    })
  }
}
