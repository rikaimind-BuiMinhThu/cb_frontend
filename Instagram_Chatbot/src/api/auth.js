import Cookies from 'js-cookie'
import axios from 'axios'

const TokenKey = 'token'
const RefreshToken = 'RefreshToken'
const userNameLogin = 'uMythos'

export function getToken() {
  console.log('token get in auth: ', Cookies.get(TokenKey))
  return (`Authorization = Bearer ${Cookies.get(TokenKey)}`)
  // axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get(TokenKey)}`
}

export function getRefreshToken() {
  return Cookies.get(RefreshToken)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshToken, token.refresh_token, token)
}

export function setToken(token, pathname) {
  console.log(pathname)
  Cookies.set(TokenKey, token, { path: pathname });
  Cookies.set(TokenKey, token, { path: '/' });
  Cookies.set(TokenKey, token, { path: '/admin/dashboard' });
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  console.log("token set in auth: ", Cookies.get(TokenKey))
  window.location.reload()
}

export function setUserName(name) {
  return Cookies.set(userNameLogin, name)
}

export function getUserName() {
  return Cookies.get(userNameLogin)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeTokenRefresh() {
  return Cookies.remove(RefreshToken)
}