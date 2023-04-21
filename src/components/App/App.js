import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../Layout/Layout';
import Articles from '../Articles/Articles';
import ArticleFull from '../ArticleFull/ArticleFull';
import SignUp from '../forms/SignUp';
import SignIn from '../forms/SignIn';
import EditProfile from '../forms/EditProfile';
import ArticleForm from '../forms/ArticleForm';
import Error404 from '../errors/Error404';
import RequireAuth from '../../hoc/RequireAuth';
import { getUserDataThunk, loadHeader } from '../../store/userSlice';
import './App.scss'

import { 
  PATH_HOME_PAGE, 
  PATH_ARTICLES, 
  PATH_ARTICLE, 
  PATH_SIGN_UP, 
  PATH_SIGN_IN, 
  PATH_PROFILE, 
  PATH_NEW_ARTICLE, 
  PATH_FULL_EDIT_ARTICLE, 
  PATH_ANY 
} from '../../path/path';

const App = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.user.isAuth)

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      dispatch(getUserDataThunk(token))
    } else {
      dispatch(loadHeader())
    }
  }, [dispatch, isAuth])
  
  return (
    <div>
      <Routes>
        <Route path={PATH_HOME_PAGE} element={<Layout />}>
          <Route index element={<Articles />} />
          <Route path={PATH_ARTICLES} element={<Articles />} />
          <Route path={PATH_ARTICLE} element={<ArticleFull />} />
          <Route path={PATH_SIGN_UP} element={
            <RequireAuth auth={true}>
              <SignUp />
            </RequireAuth>
          } />
          <Route path={PATH_SIGN_IN} element={
            <RequireAuth auth={true}>
              <SignIn />
            </RequireAuth>
          } />
          <Route path={PATH_PROFILE} element={
            <RequireAuth auth={false}>
              <EditProfile />
            </RequireAuth>
          } />
          <Route path={PATH_NEW_ARTICLE} element={
            <RequireAuth auth={false}>
              <ArticleForm edit={false}/>
            </RequireAuth>
           } />
          <Route path={PATH_FULL_EDIT_ARTICLE} element={
            <RequireAuth auth={false}>
              <ArticleForm edit={true}/>
            </RequireAuth>
          } />
          <Route path={PATH_ANY} element={<Error404 />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;