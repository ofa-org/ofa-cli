// lib/http.js

// 通过 axios 处理请求
import axios from 'axios'

axios.interceptors.response.use((res) => {
  return res.data
})

/**
 * 获取模板列表
 * @returns Promise
 */
export function getRepoList() {
  return axios.get('https://api.github.com/orgs/ofa-org/repos')
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
export function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/ofa-org/${repo}/tags`)
}
