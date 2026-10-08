import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(3, 'At least 3 characters'),
})

export const registerSchema = yup.object({
  username: yup.string().required('Username is required').min(3, 'At least 3 characters'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(3, 'At least 3 characters'),
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

export type RegisterForm = yup.InferType<typeof registerSchema>
export type LoginForm = yup.InferType<typeof loginSchema>