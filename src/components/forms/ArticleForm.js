import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "antd";
import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { PATH_ARTICLES } from "../../path/path";
import { MessageContext } from "../Layout/Layout";
import BlogService from '../../services/blog-service';
const blogService = new BlogService()

const ArticleForm = ({edit}) => {
  const [loading, setLoading] = useState(false)  
  const token = useSelector(state => state.user.token)
  const navigate = useNavigate()
  const { pushMessage } = useContext(MessageContext)
  const location = useLocation()

  const tagList = edit ? location.state.tagList.map(e => ({
    value: e
  })) : null

  const {
    register,
    formState: {errors},
    control,
    handleSubmit
  } = useForm({
    mode: 'onBlur',
    defaultValues: edit ? {tags: [...tagList]} : {}
  });

  const {fields, append, remove } = useFieldArray({
    control,
    name: 'tags'
  })

  const onSubmit = async (data) => {
    setLoading(true)
    const tags = []
    for (let tag of data.tags) {
      tags.push(tag.value)
    }
    const articleData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
      }
    }
    if (tags.length) {
      articleData.article.tagList = tags
    }
    const res = edit ? await blogService.updateArticle(token, articleData, location.state.slug) : await blogService.createArticle(token, articleData)
    if (res.ok) {
      setLoading(false)
      navigate(`${PATH_ARTICLES}/${res.result.article.slug}`)
      pushMessage('success', edit ? 'Article updated successfully' : 'Article created successfully')
    } else {
      pushMessage('error', edit ? 'Failed to update article' : 'Failed to create article')
    }
  }

  return (
    <div className="form form-lg">
      <form className="frame-lg frame-lg-shadowed" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="form__content form__content-lg">
          <h1 className="form__title">{edit ? 'Edit article' : 'Create new article'}</h1>

          {/* Title */}
          <label className="form__label">
            Title
            <input defaultValue={edit ? location.state.title : ''} {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 5,
                message: 'Title needs to be at least 5 characters'
              },
              maxLength: {
                value: 100,
                message: 'Title needs to be no more than 100 characters'
              }
            })} className="form__input form__input-lg" placeholder="Title" />
            {errors?.title && <p className='form__error'>{errors?.title?.message}</p>}
          </label>

          {/* Description */}
          <label className="form__label">
            Short description
            <input defaultValue={edit ? location.state.description : ''} {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 5,
                message: 'Description needs to be at least 5 characters'
              },
              maxLength: {
                value: 200,
                message: 'Description needs to be no more than 200 characters'
              }
            })} className="form__input form__input-lg" placeholder="Description" />
            {errors?.description && <p className='form__error'>{errors?.description?.message}</p>}
          </label>

          {/* Text */}
          <label className="form__label">
            Text
            <textarea defaultValue={edit ? location.state.body : ''} {...register('body', {
              required: 'Text is required',
              minLength: {
                value: 5,
                message: 'Text needs to be at least 5 characters'
              },
              maxLength: {
                value: 6000,
                message: 'Text needs to be no more than 6000 characters'
              }
            })} className="form__input form__input-lg form__textarea" placeholder="Text" />
            {errors?.body && <p className='form__error'>{errors?.body?.message}</p>}
          </label>

          {/* Tags */}
          <label className="form__label form__label-tags">
            Tags
            
            {fields.map((field, index) => (
              <div key={field.id} className="form__tags">
                <input maxLength='25' className="form__input" placeholder="Tag" {...register(`tags[${index}].value`, {
                  required: 'The tag must not be empty, or delete it',
                  minLength: 1,
                  maxLength: 25
                })}/>
                <button 
                  type="button" 
                  className="btn-error btn-lg-border" 
                  onClick={() => remove(index)}>
                  Delete
                </button>
                { fields.indexOf(field) === fields.length - 1 && fields.length !==5 && 
                  <button 
                    type="button" 
                    className="btn-info btn-lg-border" 
                    onClick={() => append({ name: '' })}>
                    Add tag
                  </button>}
                  {errors?.tags?.[index]?.value && <p className='form__error'style={{alignSelf: 'center'}}>{errors?.tags?.[index]?.value?.message}</p>}
              </div>
            ))}
          </label>
          { fields.length === 0 && <button type="button" className="btn-info btn-lg-border form__addtag" onClick={() => append({ name: '' })}>Add tag</button>}

          <Button loading={loading} htmlType='submit' className='form__button form__button-left' type="primary">Send</Button>  
        </fieldset>
      </form>
    </div>
  )
}

export default ArticleForm