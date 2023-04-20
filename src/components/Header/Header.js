import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logOutUser } from '../../store/userSlice'
import { useContext } from 'react'

import { MessageContext } from '../Layout/Layout'
import styles from './Header.module.scss'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuth = useSelector(state => state.user.isAuth)
  const username = useSelector(state => state.user.username)
  const image = useSelector(state => state.user.image)
  const { pushMessage } = useContext(MessageContext)

  const logOut = () => {
    localStorage.removeItem('token');
    dispatch(logOutUser())
    navigate('/', { replace: true })
    pushMessage('success', 'You are logged out')
  }

  return (
    <header className={isAuth ? styles.headerLogged : styles.header}>
      <Link className={styles.header__title} to='/'>Realworld Blog</Link>
      { isAuth === false && <Link className='btn' to='/sign-in'>Sign In</Link>}
      { isAuth === false && <Link className='btn-success btn-lg-border' to='/sign-up'>Sign Up</Link>}
      { isAuth && <Link to='/new-article' replace='true' className='btn-success btn-sm-border'>Create article</Link>}
      { isAuth && <Link to='/profile' className={styles.header__user}>
          <p className='user-name'>{username}</p>
          <div className='user-avatar'>
            <img src={image} className='user-img' alt='Аватар'/>
          </div>
        </Link>
      }
      { isAuth && <button onClick={logOut} className='btn btn-lg-border'>Log out</button>}
    </header>
  )
}

export default Header