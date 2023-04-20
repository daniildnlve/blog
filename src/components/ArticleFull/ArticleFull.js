import { useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Spin, Button } from "antd"

import { getArticleThunk, setDefaultArticle } from "../../store/articlesSlice"
import Article from "../Article/Article"
import styles from './ArticleFull.module.scss'

const ArticleFull = () => {
  const {slug} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const goBack = () => navigate('/articles')

  const article = useSelector(state => state.articles.article)
  const articlesLoading = useSelector(state => state.articles.articlesLoading)

  useEffect(() => {
    dispatch(getArticleThunk(slug))
    return () => {dispatch(setDefaultArticle())}
  }, [dispatch, slug])

  return (
    <div className={styles.articleFull}>
      { !articlesLoading && <Button onClick={goBack} size="large">&#129044; Back</Button>}
      { articlesLoading && <Spin className={styles.articlesSpin} size="large"/>}
      { !articlesLoading && article &&
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
      }
    </div>
  )
}

export default ArticleFull