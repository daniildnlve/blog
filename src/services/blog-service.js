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

  async registerUser(data) {
    const res = await fetch(`${this.baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }) 
    const result = await res.json()
    return [res.ok, result]
  }

  async loginUser(data) {
    const res = await fetch(`${this.baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const result = await res.json()
    return [res.ok, result]
  }

  async getCurrentUser(token) {
    const res = await fetch(`${this.baseUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`
      }
    });
    const result = await res.json()
    return [res.ok, result]
  }

  async updateCurrentUser(token, data) {
    const res = await fetch(`${this.baseUrl}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(data)
    })
    const result = await res.json()
    return [res.ok, result]
  }

  async createArticle(token, data) {
    const res = await fetch(`${this.baseUrl}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(data)
    })
    const result = await res.json()
    return [res.ok, result]
  }

  async updateArticle(token, data, slug) {
    const res = await fetch(`${this.baseUrl}/articles/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(data)
    })
    const result = await res.json()
    return [res.ok, result]
  }

  async deleteArticle (token, slug) {
    const res = await fetch(`${this.baseUrl}/articles/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`
      }
    })
    return { ok: res.ok }
  }
}