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
          required: `The field ${ctx.field} is required`
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
