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
import Error404 from '../errors/error404';
import { getUserDataThunk, loadHeader } from '../../store/userSlice';
import './App.scss'

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
  }, [isAuth, dispatch])
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Articles />} />
          <Route path='articles' element={<Articles />} />
          <Route path='articles/:slug' element={<ArticleFull />} />
          <Route path='sign-up' element={<SignUp />} />
          <Route path='sign-in' element={<SignIn />} />
          <Route path='profile' element={<EditProfile />} />
          <Route path='new-article' element={<ArticleForm edit={false}/>} />
          <Route path='articles/:slug/edit' element={<ArticleForm edit={true}/>} />
          <Route path='*' element={<Error404 />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;