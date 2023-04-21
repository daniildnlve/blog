import { Checkbox, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';

import { PATH_SIGN_IN, PATH_HOME_PAGE } from '../../path/path';
import { MessageContext } from '../Layout/Layout';
import BlogService from '../../services/blog-service';
const blogService = new BlogService()

const SignUp = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { pushMessage } = useContext(MessageContext)

  const {
    register,
    formState: {
      errors
    },
    handleSubmit,
    setError,
    watch,
    setValue,
    clearErrors
  } = useForm({
    mode: 'onBlur'
  })

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setValue('agreement', checked ? true : false);
  }

  const onSubmit = async (data) => {
    setLoading(true)
    clearErrors()
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password
      }
    }
    const res = await blogService.registerUser(userData)
    setLoading(false)
    if (!res.ok) {
      if (res.result.errors?.username) {
        setError('username', {
          type: 'taken',
          message: 'Username is arleady taken'
        })
      }
      if (res.result.errors?.email) {
        setError('email', {
          type: 'taken',
          message: 'Email is arleady taken'
        })
      }
    }
    if (res.ok) {
      navigate(PATH_HOME_PAGE, {replace: true})
      pushMessage('success', 'Account registered successfully')
    }
  }

  return (
    <div className="form">
      <form className="frame-sm" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="form__content">
          <h1 className="form__title">Create new account</h1>

          {/* Username */}
          <label className="form__label">
            Username
            <input {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Your username needs to be at least 3 characters'
              },
              maxLength: {
                value: 20,
                message: 'Your username needs to be no more than 20 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'The username must consist of English letters and numbers without spaces'
              }
            })} className="form__input" placeholder="Username"/>
            {errors?.username && <p className='form__error'>{errors?.username?.message}</p>}
          </label>

          {/* Email */}
          <label className="form__label">
            Email address
            <input {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                message: 'Email is incorrect'
              },
              setValueAs: v => v.toLowerCase()
            })} className="form__input" placeholder="Email address"/>
            {errors?.email && <p className='form__error'>{errors?.email?.message}</p>}
          </label>

          {/* Password */}
          <label className="form__label">
            Password
            <input {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters'
              },
              maxLength: {
                value: 40,
                message: 'Your password needs to be no more than 40 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'The password must consist of English letters and numbers without spaces'
              }
            })} type='password' className="form__input" placeholder="Password"/>
            {errors?.password && <p className='form__error'>{errors?.password?.message}</p>}
          </label>

          {/* Repeat Password */}
          <label className="form__label">
            Repeat Password
            <input {...register('repeat_password', {
              required: 'Repeat password is required',
              validate: (v) => {
                if (watch('password') !== v) {
                  return "Value doesn't match password"
                }
              }
            })} type='password' className="form__input" placeholder="Password"/>
             {errors?.repeat_password && <p className='form__error'>{errors?.repeat_password?.message}</p>}
          </label>

          {/* Agreement */}
          <Checkbox 
            {...register('agreement', {required: 'Agreement is required'})} 
            onChange={handleCheckboxChange} 
            className='form__checkbox'>
              I agree to the processing of my personal information
          </Checkbox>
          {errors?.agreement && <p className='form__error'>{errors?.agreement.message}</p>}
          
          <Button loading={loading} htmlType='submit' className='form__button' type="primary">Create</Button>
          <p className='form__tip'>Already have an account? <Link to={PATH_SIGN_IN} className='form__link'>Sign In.</Link></p>
        </fieldset>
      </form>
    </div>
  )
}

export default SignUp