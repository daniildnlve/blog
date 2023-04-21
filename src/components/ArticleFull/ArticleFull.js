import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin, Button } from 'antd'

import { getArticleThunk, setDefaultArticle } from '../../store/articlesSlice'
import { PATH_ARTICLES } from '../../path/path'
import Article from '../Article/Article'
import ErrorArticle from '../errors/ErrorArticle'

import styles from './ArticleFull.module.scss'

const ArticleFull = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const goBack = () => navigate(PATH_ARTICLES)

  const article = useSelector((state) => state.articles.article)
  const articlesLoading = useSelector((state) => state.articles.articlesLoading)
  const articlesError = useSelector((state) => state.articles.articlesError)

  const token = localStorage.getItem('token')

  useEffect(() => {
    dispatch(getArticleThunk({ slug, token }))
    return () => {
      dispatch(setDefaultArticle())
    }
  }, [dispatch, slug, token])

  return (
    <div className={styles.articleFull}>
      {!articlesLoading && !articlesError && (
        <Button onClick={goBack} size="large">
          &#129044; Back
        </Button>
      )}
      {articlesLoading && <Spin className={styles.articlesSpin} size="large" />}
      {!articlesLoading && article && (
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
          full={true}
        />
      )}
      {articlesError && <ErrorArticle />}
    </div>
  )
}

export default ArticleFull
