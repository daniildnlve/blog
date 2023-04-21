/* eslint-disable react/no-children-prop */
/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { Popconfirm } from 'antd'
import { useContext, useState } from 'react'

import { MessageContext } from '../Layout/Layout'
import { PATH_ARTICLES, PATH_EDIT_ARTICLE, PATH_SIGN_IN } from '../../path/path'
import BlogService from '../../services/blog-service'

import styles from './Article.module.scss'

const blogService = new BlogService()

const Article = ({ author, body, description, slug, tagList, favorited, favoritesCount, title, updatedDate, full }) => {
  const [likes, setLikes] = useState(favoritesCount)
  const [liked, setLiked] = useState(favorited)

  const username = useSelector((state) => state.user.username)
  const token = useSelector((state) => state.user.token)

  const navigate = useNavigate()
  const { pushMessage } = useContext(MessageContext)

  const tags = [...new Set(tagList)].map((tag) => {
    if (tag.trim() === '') {
      return null
    }
    if (tag.length > 20) {
      return null
    }
    return (
      <li key={tag} className={full ? styles.article__tagFull : styles.article__tag}>
        {tag}
      </li>
    )
  })

  const toggleFavorite = async () => {
    if (liked) {
      const res = await blogService.removeLikeArticle(token, slug)
      if (res.ok) {
        setLiked(res.result.article.favorited)
        setLikes(res.result.article.favoritesCount)
      } else {
        pushMessage('error', 'Failed to like')
      }
    } else if (!liked) {
      const res = await blogService.likeArticle(token, slug)
      if (res.ok) {
        setLiked(res.result.article.favorited)
        setLikes(res.result.article.favoritesCount)
      } else {
        pushMessage('error', 'Failed to like')
      }
    }
  }

  const deleteArticle = async () => {
    const res = await blogService.deleteArticle(token, slug)
    if (res.ok) {
      navigate(PATH_ARTICLES, { replace: true })
      pushMessage('success', 'Article deleted successfully')
    } else {
      pushMessage('error', 'Failed to delete article')
    }
  }

  const DeleteButton = () => {
    return (
      <Popconfirm title="Are you sure to delete this article?" okText="Yes" cancelText="No" onConfirm={deleteArticle}>
        <button className="btn-error btn-sm-border">Delete</button>
      </Popconfirm>
    )
  }

  return (
    <div className={`frame-lg ${full ? styles.articleFull : styles.article}`}>
      <div className={styles.article__heading}>
        <div>
          {full ? (
            <span className={styles.article__title}>{title}</span>
          ) : (
            <Link className={styles.article__title} to={`${PATH_ARTICLES}/${slug}`}>
              {title}
            </Link>
          )}
          <span className={styles.article__likes}>
            <button
              onClick={
                token
                  ? toggleFavorite
                  // eslint-disable-next-line prettier/prettier
                  : () => { 
                    navigate(PATH_SIGN_IN) 
                    pushMessage('info', 'You must be logged in for this action') 
                  }
              }
              className={styles.article__likeButton}
            >
              <svg
                className={liked ? styles.article__likeOn : styles.article__likeOff}
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 2.56911C7.26154 1.33835 6.03077 0.476807 4.55385 0.476807C2.46154 0.476807 0.861542 2.07681 0.861542 4.16911C0.861542 8.23065 3.07693 8.84604 8 13.523C12.9231 8.84604 15.1385 8.23065 15.1385 4.16911C15.1385 2.07681 13.5385 0.476807 11.4462 0.476807C9.96923 0.476807 8.73846 1.33835 8 2.56911Z" />
              </svg>
            </button>
            {likes}
          </span>
          <ul className={styles.article__tags}>{tags}</ul>
        </div>
        <div>
          <div className={styles.article__info}>
            <span>
              <p className="user-name">{author.username}</p>
              <p className={styles.article__date}>{format(new Date(updatedDate), 'MMMM dd, yyyy')}</p>
            </span>
            <div className="user-avatar">
              <img className="user-img" src={author.image} alt="user avatar" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', columnGap: '12px', alignItems: 'center', marginTop: '4px' }}>
        <p className={full ? styles.article__textFull : styles.article__text}>{description}</p>
        {full && username === author.username && <DeleteButton />}
        {full && username === author.username && (
          <Link
            to={`${PATH_ARTICLES}/${slug}${PATH_EDIT_ARTICLE}`}
            state={{ body, description, tagList, title, slug }}
            className="btn-success btn-sm-border"
          >
            Edit
          </Link>
        )}
      </div>
      {full ? <ReactMarkdown className={styles.article__body} children={body} /> : null}
    </div>
  )
}

export default Article
