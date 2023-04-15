import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import styles from './Article.module.scss'

const Article = ({author, body, createdDate, description, slug, tagList, favorited, favoritesCount, title, updatedDate, full}) => {

  const tags = [...new Set(tagList)].map(tag => {
    if (tag === '') {
      return null
    } 
    if (tag.length > 20) {
      return null
    }
    return (
      <li key={tag} className={full ? styles.article__tagFull : styles.article__tag}>{tag}</li>
    )
  })  
  
  return (
    <div className={`frame-lg ${styles.article}`}>
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
      <p className={full ? styles.article__textFull : styles.article__text}>{description}</p>
      {full ? <ReactMarkdown className={styles.article__body} children={body}/> : null}
    </div>
  )
}

export default Article;