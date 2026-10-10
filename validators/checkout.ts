import * as yup from 'yup'
import { profileSchema } from './profile'

export const checkoutSchema = yup.object({
  fullName: profileSchema.fields.fullName,
  email: yup.string().trim().required('Email is required').email('Enter a valid email'),
  mobileNumber: profileSchema.fields.mobileNumber,

  cardNumber: yup
    .string()
    .transform((v) => (typeof v === 'string' ? v.replace(/\s/g, '') : v)) 
    .required('Card number is required')
    .matches(/^\d{16}$/, 'Card number must be 16 digits'),

  expiry: yup
    .string()
    .trim()
    .required('Expiry is required')
    .test('expiry', function (value) {
      if (!value) return true 
      const m = /^(\d{2})\/(\d{2})$/.exec(value)
      if (!m) return this.createError({ message: 'Use the format MM/YY' })

      const month = Number(m[1])
      const year = 2000 + Number(m[2])
      if (month < 1 || month > 12) return this.createError({ message: 'Enter a valid month (01-12)' })

      const now = new Date()
      if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        return this.createError({ message: 'This card has expired' })
      }
      return true
    }),

  cvv: yup.string().required('CVV is required').matches(/^\d{3}$/, 'CVV must be 3 digits'),
})

export type CheckoutValues = yup.InferType<typeof checkoutSchema>