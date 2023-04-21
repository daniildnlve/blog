import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination, Spin } from 'antd'

import ErrorArticle from '../errors/ErrorArticle'
import Article from '../Article/Article'
import { getArticleListThunk, setDefaultArticleList } from '../../store/articlesSlice'

import styles from './Articles.module.scss'

const Articles = () => {
  const [page, setPage] = useState(1)
  const token = localStorage.getItem('token')

  const dispatch = useDispatch()
  const articles = useSelector((state) => state.articles.articleList)
  const articlesCount = useSelector((state) => state.articles.articlesCount)
  const articlesLoading = useSelector((state) => state.articles.articlesLoading)
  const articlesError = useSelector((state) => state.articles.articlesError)

  useEffect(() => {
    if (page !== 1) {
      dispatch(getArticleListThunk({ page: (page - 1) * 5, token: token }))
    } else {
      dispatch(getArticleListThunk({ page: page - 1, token: token }))
    }
    return () => {
      dispatch(setDefaultArticleList())
    }
  }, [dispatch, page, token])

  const elements = articles.map((article) => {
    return (
      <li key={article.slug}>
        <Article
          author={article.author}
          body={article.body}
          createdDate={article.createdAt}
          description={article.description}
          slug={article.slug}
          tagList={article.tagList}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
          title={article.title}
          updatedDate={article.updatedAt}
          full={false}
        />
      </li>
    )
  })

  return (
    <div className={styles.articlesContainer}>
      <ul className={styles.articles}>
        {articlesLoading && <Spin className={styles.articlesSpin} size="large" />}
        {!articlesLoading && !articlesError && elements}
        {articlesError && <ErrorArticle />}
      </ul>
      {!articlesLoading && articles.length !== 0 && !articlesError && (
        <Pagination
          className={styles.articles__pagination}
          current={page}
          onChange={(num) => setPage(num)}
          defaultPageSize={5}
          total={articlesCount - 5}
          showSizeChanger={false}
        />
      )}
    </div>
  )
}

export default Articles
