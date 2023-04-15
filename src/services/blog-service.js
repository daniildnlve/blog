export default class BlogService {
  baseUrl = 'https://blog.kata.academy/api'
  
  async getResource(url) {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error()
    }
    return await res.json()
  }

  async getArticleList(page = 0) {
    const res = await this.getResource(`${this.baseUrl}/articles?limit=5&offset=${page}`)
    return res;
  }

  async getArticle(slug) {
    const res = await this.getResource(`${this.baseUrl}/articles/${slug}`)
    return res;
  }
}