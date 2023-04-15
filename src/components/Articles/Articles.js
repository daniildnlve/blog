import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Pagination, Spin } from 'antd'

import Article from "../Article/Article"
import { getArticleListThunk, setDefaultArticleList } from "../../store/articlesSlice"
import styles from './Articles.module.scss'

const Articles = () => {
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const articles = useSelector(state => state.articles.articleList)
  const articlesCount = useSelector(state => state.articles.articlesCount)
  const articlesLoading = useSelector(state => state.articles.articlesLoading)
   
  useEffect(() => {
    if (page !== 1) {
      dispatch(getArticleListThunk(page * 5 - 1));
    } else {
      dispatch(getArticleListThunk(page - 1))
    }
    return () => {dispatch(setDefaultArticleList())}
  }, [dispatch, page])
 
  const elements = articles.map(article => {
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
        {articlesLoading && <Spin className={styles.articlesSpin} size="large"/>}
        {!articlesLoading && elements}
      </ul>
      {!articlesLoading && <Pagination
        current={page}
        onChange={num => setPage(num)}
        defaultPageSize={5} 
        total={articlesCount - 5}  
        showSizeChanger={false}
      />}
    </div>
  )
}

export default Articles