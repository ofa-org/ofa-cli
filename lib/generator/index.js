import { getPkg } from '../utils/index.js'

// 生成模板
export default async function (options) {
  console.log(`output->options`, options)
  const pkg = getPkg()
  console.log(`output->pkg`, pkg)
}
