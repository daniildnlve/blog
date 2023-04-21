import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { PATH_SIGN_UP, PATH_HOME_PAGE } from '../../path/path';
import { MessageContext } from '../Layout/Layout';
import BlogService from '../../services/blog-service';
import { getUserDataThunk } from '../../store/userSlice';
const blogService = new BlogService()


const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { pushMessage } = useContext(MessageContext)

  const {
    register,
    formState: {
      errors
    },
    handleSubmit,
    setError,
    clearErrors
  } = useForm({
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setLoading(true);
    clearErrors()
    const userData = {
      user: {
        email: data.email,
        password: data.password
      }
    }
    const res = await blogService.loginUser(userData)
    if (!res.ok) {
      setLoading(false)
      if (res.result.errors?.["email or password"]) {
        setError('password', {
          type: 'invalid',
          message: 'Email or password is invalid'
        })
      } else {
        pushMessage('error', 'Failed to authorize')
      }
    }
    if (res.ok) {
      localStorage.setItem('token', res.result.user.token)
      setLoading(false)
      dispatch(getUserDataThunk(localStorage.getItem('token'))).then(navigate(PATH_HOME_PAGE, {replace: true}))
      pushMessage('success', 'You are logged in')
    } 
  }

  return (
    <div className="form">
      <form className="frame-sm" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="form__content">
          <h1 className="form__title">Sign In</h1>

           {/* Email */}
          <label className="form__label">
            Email address
            <input {...register('email', {
              required: 'Email is required'
            })} className="form__input" placeholder="Email address"/>
            {errors?.email && <p className='form__error'>{errors?.email?.message}</p>}
          </label>

          {/* Password */}
          <label className="form__label">
            Password
            <input {...register('password', {
              required: 'Password is required'
            })} type='password' className="form__input" placeholder="Password"/>
            {errors?.password && <p className='form__error'>{errors?.password?.message}</p>}
          </label>

          <Button loading={loading} htmlType='submit' className='form__button' type="primary">Login</Button>
          <p className='form__tip'>Don't have an account? <Link to={PATH_SIGN_UP} className='form__link'>Sign Up.</Link></p>
        </fieldset>
      </form>
    </div>
  )
}

export default SignIn