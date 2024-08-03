// lib/create.js

import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import Generator from './generator.js'

export default async function (name, options) {
  // 当前命令行选择的目录
  const cwd = process.cwd()
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name)
  console.log(`output->cwd`, cwd)
  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      // 询问用户是否确定要覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '目录已存在，是否覆盖？',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite',
            },
            {
              name: '取消',
              value: false,
            },
          ],
        },
      ])

      if (!action) {
        return
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir)

  // 开始创建项目
  generator.create()
}
