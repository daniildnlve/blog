import { Routes, Route } from 'react-router-dom';

import Layout from '../Layout/Layout';
import Articles from '../Articles/Articles';
import ArticleFull from '../ArticleFull/ArticleFull';
import Error404 from '../errors/error404';
import './App.scss'

const App = () => {
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Articles />} />
          <Route path='articles' element={<Articles />} />
          <Route path='articles/:slug' element={<ArticleFull />}/>
          <Route path='*' element={<Error404 />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App;