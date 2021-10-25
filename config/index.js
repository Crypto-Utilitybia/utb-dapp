const PROXY_URL = process.env.NODE_ENV === 'production'
  ? 'https://avaxcoins.com'
  : 'http://localhost:3000'

export {
  PROXY_URL
}