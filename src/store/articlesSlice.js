import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BlogService from '../services/blog-service'
const blogService = new BlogService()

export const getArticleListThunk = createAsyncThunk('articles/getArticleListThunk', async function(page) {
  const res = await blogService.getArticleList(page)
  return res
})

export const getArticleThunk = createAsyncThunk('articles/getArticleThunk', async function(slug) {
  const res = await blogService.getArticle(slug)
  return res
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articleList: [],
    article: null,
    articlesLoading: false,
    articlesCount: 0,
  },
  reducers: {
    setDefaultArticleList(state) {
      state.articleList = []
    },
    setDefaultArticle(state) {
      state.article = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticleListThunk.pending, (state) => {
        state.articlesLoading = true
      })
      .addCase(getArticleListThunk.fulfilled, (state, action) => {
        state.articleList = [...action.payload.articles]
        state.articlesCount = action.payload.articlesCount
        state.articlesLoading = false
      })
      .addCase(getArticleListThunk.rejected, (state) => {

      })
      .addCase(getArticleThunk.pending, (state) => {
        state.articlesLoading = true
      })
      .addCase(getArticleThunk.fulfilled, (state, action) => {
        state.article = action.payload.article
        state.articlesLoading = false
      })
      .addCase(getArticleThunk.rejected, (state) => {

      })
  }
})

export const { setDefaultArticle, setDefaultArticleList } = articlesSlice.actions
export default articlesSlice.reducer