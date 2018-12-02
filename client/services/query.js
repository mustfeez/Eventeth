let apiUrl = 'https://api.eventeth'

if (window.location.hostname === 'localhost') {
  apiUrl = 'http://localhost:8000'
}

async function getPosts () {
  const response = await fetch(`${apiUrl}/posts`)
  const json = await response.json()
  return json.posts
}

module.exports = {
  getPosts
}
