import * as yup from 'yup'

const toISO = (d: Date) => d.toLocaleDateString('en-CA')

export const profileSchema = yup.object({
    fullName: yup
        .string()
        .trim()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must not exceed 50 characters'),

    mobileNumber: yup
        .string()
        .transform((v) => (typeof v === 'string' ? v.replace(/\s/g, '') : v)) // "599 123 456" -> "599123456"
        .required('Mobile number is required')
        .test('georgian-mobile', function (value) {
            if (!value) return true
            if (!/^\d+$/.test(value))
                return this.createError({
                    message: 'Please enter a valid Georgian mobile number (9 digits starting with 5)',
                })
            if (!value.startsWith('5'))
                return this.createError({ message: 'Georgian mobile numbers must start with 5' })
            if (value.length !== 9)
                return this.createError({ message: 'Mobile number must be exactly 9 digits' })
            return true
        }),

    dateOfBirth: yup
        .string()
        .required('Date of birth is required')
        .test('birth-date', function (value) {
            if (!value) return true
            const today = new Date()
            if (value > toISO(today))
                return this.createError({ message: 'Please enter a valid date of birth' })

            const cutoff = new Date(today)
            cutoff.setFullYear(cutoff.getFullYear() - 12)
            if (value > toISO(cutoff))
                return this.createError({
                    message: 'You must be at least 12 years old to create an account',
                })
            return true
        }),

    preferredVenueId: yup.string().defined(),
})

export type ProfileFormValues = yup.InferType<typeof profileSchema>