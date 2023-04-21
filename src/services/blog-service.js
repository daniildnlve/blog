export default class BlogService {
  baseUrl = 'https://blog.kata.academy/api'
  
  async getArticleList(page = 0, token) {
    const res = await fetch(`${this.baseUrl}/articles?limit=5&offset=${page}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    const result = await res.json()
    return {ok: res.ok, result: result}
  }

  async getArticle(slug, token) {
    const res = await fetch(`${this.baseUrl}/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    const result = await res.json()
    return {ok: res.ok, result: result}
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
    return {ok: res.ok, result: result}
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
    return {ok: res.ok, result: result}
  }

  async getCurrentUser(token) {
    const res = await fetch(`${this.baseUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`
      }
    });
    const result = await res.json()
    return {ok: res.ok, result: result}
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
    return {ok: res.ok, result: result}
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
    return {ok: res.ok, result: result}
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
    return {ok: res.ok, result: result}
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

  async likeArticle (token, slug) {
    const res = await fetch(`${this.baseUrl}/articles/${slug}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`
      }
    })
    const result = await res.json()
    return { ok: res.ok, result: result }
  }

  async removeLikeArticle (token, slug) {
    const res = await fetch(`${this.baseUrl}/articles/${slug}/favorite`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`
      }
    })
    const result = await res.json()
    return { ok: res.ok, result: result }
  }
}