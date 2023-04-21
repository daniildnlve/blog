import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BlogService from '../services/blog-service'
const blogService = new BlogService()

export const getArticleListThunk = createAsyncThunk('articles/getArticleListThunk', async function ({ page, token }) {
  const res = await blogService.getArticleList(page, token)
  if (!res.ok) {
    throw new Error()
  }
  return res.result
})

export const getArticleThunk = createAsyncThunk('articles/getArticleThunk', async function ({ slug, token }) {
  const res = await blogService.getArticle(slug, token)
  if (!res.ok) {
    throw new Error()
  }
  return res.result
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articleList: [],
    article: null,
    articlesLoading: false,
    articlesCount: 0,
    articlesError: false,
  },
  reducers: {
    setDefaultArticleList(state) {
      state.articleList = []
    },
    setDefaultArticle(state) {
      state.article = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticleListThunk.pending, (state) => {
        state.articlesLoading = true
        state.articlesError = false
      })
      .addCase(getArticleListThunk.fulfilled, (state, action) => {
        state.articleList = [...action.payload.articles]
        state.articlesCount = action.payload.articlesCount
        state.articlesLoading = false
      })
      .addCase(getArticleListThunk.rejected, (state) => {
        state.articlesLoading = false
        state.articlesError = true
      })
      .addCase(getArticleThunk.pending, (state) => {
        state.articlesLoading = true
        state.articlesError = false
      })
      .addCase(getArticleThunk.fulfilled, (state, action) => {
        state.article = action.payload.article
        state.articlesLoading = false
      })
      .addCase(getArticleThunk.rejected, (state) => {
        state.articlesLoading = false
        state.articlesError = true
      })
  },
})

export const { setDefaultArticle, setDefaultArticleList } = articlesSlice.actions
export default articlesSlice.reducer
