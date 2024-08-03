import { readPackageSync } from 'read-pkg'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
export function getPkg() {
  const __filename = fileURLToPath(import.meta.url)
  console.log(`output->__filename`, __filename)
  const __dirname = join(dirname(__filename), '../..')
  console.log(`output->__dirname`, __dirname)
  const pkg = readPackageSync({ cwd: __dirname })
  return pkg
}
