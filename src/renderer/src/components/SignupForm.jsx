import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const SignupForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const password = watch('password', '')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      reset() // Başarılı kayıt sonrası formu temizle
    } catch (error) {
      console.error('Form gönderme hatası:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-xl">
      <div className="mb-4">
        <label className="block  text-neutral-700 text-sm font-bold mb-2" htmlFor="username">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          type="text"
          placeholder="username"
          className={`shadow appearance-none border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3  text-neutral-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters.' },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Only include characters, numbers and special characters.'
            }
          })}
        />
        {errors.username && (
          <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="py-2">
        <label className="block  text-neutral-700 text-sm font-bold mb-2" htmlFor="fullName">
          Name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="name"
          className={`shadow appearance-none border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3  text-neutral-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
          {...register('fullName')}
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs italic mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div className="py-2">
        <label className="block  text-neutral-700 text-sm font-bold mb-2" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          placeholder="posta@gmail.com"
          className={`shadow appearance-none border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3  text-neutral-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
          {...register('email', {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Geçersiz e-posta adresi'
            }
          })}
        />
        {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
      </div>

      <div className="pt-4">
        <label className="block  text-neutral-700 text-sm font-bold mb-2" htmlFor="password">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={passwordVisible ? 'text' : 'password'}
            placeholder="********"
            className={`shadow appearance-none border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3  text-neutral-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
            {...register('password', {
              required: 'Parola gerekli',
              minLength: { value: 6, message: 'Parola en az 6 karakter olmalıdır' },
              validate: (value) => {
                return (
                  [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].every((pattern) =>
                    pattern.test(value)
                  ) ||
                  'Parola en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir'
                )
              }
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center  text-neutral-700"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                  clipRule="evenodd"
                />
                <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">Must be at least 6 characters.</p>
      </div>

      <div className="pt-2 pb-6">
        <label className="block  text-neutral-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
          Confirm <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={confirmPasswordVisible ? 'text' : 'password'}
            placeholder="********"
            className={`shadow appearance-none border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3  text-neutral-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
            {...register('confirmPassword', {
              required: 'Parolayı onaylamalısınız',
              validate: (value) => value === password || 'Parolalar eşleşmiyor'
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center  text-neutral-700"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            {confirmPasswordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                  clipRule="evenodd"
                />
                <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('terms', {
              required: 'You need to accept rules and conditions.'
            })}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 py-3">
            <span className="text-red-500 pl-2">*</span> I accept &nbsp;
            <a href="#" className="text-blue-600 hover:text-blue-800">
              rules and conditions.
            </a>{' '}
          </label>
        </div>
        {errors.terms && <p className="text-red-500 text-xs italic mt-1">{errors.terms.message}</p>}
      </div>

      <div className="mt-6">
        {/* <p className="text-xs text-gray-600 mb-4 pb-3">
          <span className="text-red-500">*</span> işaretli alanlar zorunludur.
        </p> */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registering...
            </span>
          ) : (
            'Register'
          )}
        </button>
      </div>
    </form>
  )
}

export default SignupForm
