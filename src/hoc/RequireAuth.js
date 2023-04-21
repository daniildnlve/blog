import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useContext } from 'react'

import { PATH_SIGN_IN, PATH_HOME_PAGE } from '../path/path'
import { MessageContext } from '../components/Layout/Layout'

const RequireAuth = ({ children, auth }) => {
  const isAuth = useSelector((state) => state.user.isAuth)
  const { pushMessage } = useContext(MessageContext)

  if (!auth) {
    if (!isAuth) {
      pushMessage('info', 'You must be logged in to access this page')
      return <Navigate to={PATH_SIGN_IN} />
    }
    return children
  }
  if (auth) {
    if (isAuth) {
      pushMessage('info', 'Log out of your account to access this page')
      return <Navigate to={PATH_HOME_PAGE} />
    }
    return children
  }
}

export default RequireAuth
