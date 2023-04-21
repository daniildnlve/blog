import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logOutUser } from '../../store/userSlice'
import { useContext } from 'react'

import { PATH_HOME_PAGE, PATH_SIGN_IN, PATH_SIGN_UP, PATH_PROFILE, PATH_NEW_ARTICLE } from '../../path/path'
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
    navigate(PATH_HOME_PAGE, { replace: true })
    pushMessage('success', 'You are logged out')
  }

  return (
    <header className={isAuth ? styles.headerLogged : styles.header}>
      <Link className={styles.header__title} to={PATH_HOME_PAGE}>Realworld Blog</Link>
      { isAuth === false && <Link className='btn' to={PATH_SIGN_IN}>Sign In</Link>}
      { isAuth === false && <Link className='btn-success btn-lg-border' to={PATH_SIGN_UP}>Sign Up</Link>}
      { isAuth && <Link to={PATH_NEW_ARTICLE} replace='true' className='btn-success btn-sm-border'>Create article</Link>}
      { isAuth && <Link to={PATH_PROFILE} className={styles.header__user}>
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