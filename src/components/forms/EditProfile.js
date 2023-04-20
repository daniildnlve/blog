import { Button } from 'antd';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserDataThunk } from '../../store/userSlice';
import BlogService from '../../services/blog-service';
const blogService = new BlogService()

const EditProfile = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const email = useSelector(state => state.user.email)
  const username = useSelector(state => state.user.username)
  const token = useSelector(state => state.user.token)

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
    const filteredKeys = Object.keys(data).filter(key => data[key] !== ""); 
    const filteredObj = filteredKeys.reduce((result, key) => {
      result[key] = data[key];
      return result;
    }, {});
    if (!Object.keys(filteredObj).length) {
      return console.log('Пустой')
    } else {
      setLoading(true)
      const res = await blogService.updateCurrentUser(token, {user: {...filteredObj}})
      if (!res[0]) {
        if (res[1].errors?.username) {
          setError('username', {
            type: 'taken',
            message: 'Username is arleady taken'
          })
        }
        if (res[1].errors?.email) {
          setError('email', {
            type: 'taken',
            message: 'Email is arleady taken'
          })
        }
        return setLoading(false)
      }
      if (res[0]) {
        dispatch(getUserDataThunk(token))
        return setLoading(false)
      }
    }
  }

  return (
    // Не ставил здесь правила "поле не должно быть пустым". Потому что тогда после перезагрузки при первом клике поля с defaultValue расцениваются как пустая строка
    // и появляется ошибка валидации. Проще не отправлять на сервер пустые или неизменённые значения.
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
              setValueAs: v => v.toLowerCase()
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