import { configureStore } from '@reduxjs/toolkit'

import articlesReducer from './articlesSlice'

export default configureStore({
  reducer: {
    articles: articlesReducer
  },
})