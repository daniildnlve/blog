import { Button } from 'antd';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserDataThunk } from '../../store/userSlice';
import { MessageContext } from '../Layout/Layout';
import BlogService from '../../services/blog-service';
const blogService = new BlogService()

const EditProfile = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const email = useSelector(state => state.user.email)
  const username = useSelector(state => state.user.username)
  const token = useSelector(state => state.user.token)

  const { pushMessage } = useContext(MessageContext)

  const {
    register,
    formState: {
      errors
    },
    handleSubmit,
    setError,
  } = useForm({
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    setLoading(true)
    const filteredKeys = Object.keys(data).filter(key => data[key] !== ""); 
    const filteredObj = filteredKeys.reduce((result, key) => {
      result[key] = data[key];
      return result;
    }, {});
    if (!Object.keys(filteredObj).length) {
      setLoading(false)
      return pushMessage('warning', `You didn't change anything`)
    } else {
      const res = await blogService.updateCurrentUser(token, {user: {...filteredObj}})
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
        return setLoading(false)
      }
      if (res.ok) {
        dispatch(getUserDataThunk(token))
        pushMessage('success', 'Profile has changed')
        return setLoading(false)
      }
    }
  }

  return (
    <div className="form">
      <form className="frame-sm" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="form__content">
          <h1 className="form__title">Edit Profile</h1>

          <label className="form__label">
            Username
            <input defaultValue={username} {...register('username', {
              minLength: {
                value: 3,
                message: 'Your username needs to be at least 3 characters'
              },
              maxLength: {
                value: 20,
                message: 'Your username needs to be no more than 20 characters'
              },
              validate: (v) => {
                if (v.trim().length === 0) {
                  return 'Username must not be empty'
                }
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'The username must consist of English letters and numbers without spaces'
              }
            })} className="form__input" placeholder="Username"/>
            {errors?.username && <p className='form__error'>{errors?.username?.message}</p>}
          </label>

          <label className="form__label">
            Email address
            <input defaultValue={email} {...register('email', {
              pattern: {
                value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                message: 'Email is incorrect'
              },
              setValueAs: v => v.toLowerCase(),
              validate: (v) => {
                if (v.trim().length === 0) {
                  return 'Email must not be empty'
                }
              }
            })} className="form__input" placeholder="Email address"/>
            {errors?.email && <p className='form__error'>{errors?.email?.message}</p>}
          </label>

          <label className="form__label">
            New Password
            <input {...register('password', {
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
            })} type='password' className="form__input" placeholder="New password"/>
            {errors?.password && <p className='form__error'>{errors?.password?.message}</p>}
          </label>

          <label className="form__label">
            Avatar image (url)
            <input {...register('image', {
              pattern: {
                value: /https?:\/\/(.+?)\/(([a-zA-Z0-9_ \-%\.]*)\.(jpg|png|jpeg|gif))/,
                message: 'URL is incorrect'
              }
            })} className="form__input" placeholder="Avatar image"/>
            {errors?.image && <p className='form__error'>{errors?.image?.message}</p>}
          </label>

          <Button loading={loading} htmlType='submit' className='form__button' type="primary">Save</Button>  
        </fieldset>
      </form>
    </div>
  )
}

export default EditProfile