import React from 'react'
import { useForm } from 'react-hook-form'

const LoginForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          className={`shadow appearance-none border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
          {...register('username', { required: 'Username required' })}
        />
        {errors.username && (
          <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="pt-2">
        <label className="block  text-neutral-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`shadow appearance-none border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
          {...register('password', {
            required: 'Password required',
            minLength: { value: 6, message: 'At least 6 characters required ' }
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-8">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer"
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginForm
