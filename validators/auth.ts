import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(3, 'At least 3 characters'),
})

export type LoginForm = yup.InferType<typeof loginSchema>