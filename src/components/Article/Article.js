import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { Popconfirm } from 'antd'
import { useContext } from 'react'

import { MessageContext } from '../Layout/Layout';
import styles from './Article.module.scss'
import BlogService from '../../services/blog-service'
const blogService = new BlogService()

const Article = ({author, body, description, slug, tagList, favorited, favoritesCount, title, updatedDate, full}) => {
  const username = useSelector(state => state.user.username)
  const token = useSelector(state => state.user.token)

  const navigate = useNavigate()
  const { pushMessage } = useContext(MessageContext)

  const tags = [...new Set(tagList)].map(tag => {
    if (tag.trim() === '') {
      return null
    } 
    if (tag.length > 20) {
      return null
    }
    return (
      <li key={tag} className={full ? styles.article__tagFull : styles.article__tag}>{tag}</li>
    )
  })  
  
  const deleteArticle = async () => {
    const res = await blogService.deleteArticle(token, slug)
    if (res.ok) {
      navigate('/articles', {replace: true})
      pushMessage('success', 'Article deleted successfully')
    }
  }

  const DeleteButton = () => {
    return (
      <Popconfirm
        title="Are you sure to delete this article?"
        okText="Yes"
        cancelText="No"
        onConfirm={deleteArticle}
      >
        <button className='btn-error btn-sm-border'>Delete</button>
      </Popconfirm>
    )
  }

  return (
    <div className={`frame-lg ${full ? styles.articleFull : styles.article}`}>
      <div className={styles.article__heading}>
        <div>
          { full ?
            <span className={styles.article__title}>{title}</span>
            :
            <Link className={styles.article__title} to={`/articles/${slug}`} >{title}</Link>
          }
          <span className={styles.article__likes}>
            <button className={styles.article__likeButton}/>
            {favoritesCount}
          </span>
          <ul className={styles.article__tags}>
            {tags}
          </ul>
        </div>
        <div>
          <div className={styles.article__info}>
            <span>
              <p className='user-name'>{author.username}</p>
              <p className={styles.article__date}>{format(new Date(updatedDate), 'MMMM dd, yyyy')}</p>
            </span>
            <div className='user-avatar'>
              <img className='user-img' src={author.image} alt='user avatar'/>
            </div>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', columnGap: '12px', alignItems: 'center', marginTop: '4px'}}>
        <p className={full ? styles.article__textFull : styles.article__text}>{description}</p>    
        { full && username === author.username && <DeleteButton />}
        { full && username === author.username && <Link to={`/articles/${slug}/edit`} state={{body, description, tagList, title, slug}} className='btn-success btn-sm-border'>Edit</Link>}
      </div>
      {full ? <ReactMarkdown className={styles.article__body} children={body}/> : null}
    </div>
  )
}

export default Article;