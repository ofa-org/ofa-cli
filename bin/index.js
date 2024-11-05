#! /usr/bin/env node

import figlet from 'figlet'
import chalk from 'chalk'
import { Command } from 'commander'
import create from '../lib/create/index.js'
import generator from '../lib/generator/index.js'
import { getPkg } from '../lib/utils/index.js'

exec()
function exec() {
  const pkg = getPkg()
  // 当前命令行选择的目录
  const program = new Command()
  program
    // 定义命令和参数
    .command('create <app-name>')
    .alias('c')
    .description('新建项目')
    .option('-f, --force', '如果目录存在则直接覆盖')
    .action((name, options) => {
      create(name, options)
    })

  // 生成组件模板/页面模板
  program
    .command('gen')
    .alias('g')
    .description(' 生成组件模板/页面模板')
    .option('-c, --component <name>', 'component')
    .option('-p, --page <name>', 'component')
    .action((option) => {
      generator(option)
    })

  program
    // 配置版本号信息
    .version(`v${pkg.version}`)
    .usage('<command> [option]')
    .on('--help', () => {
      console.log(
        '\r\n' +
          figlet.textSync('one for all', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 120,
            whitespaceBreak: false,
          })
      )

      // 新增说明信息
      console.log(
        `\r\n执行 ${chalk.cyan(
          `ofa-cli <command> --help`
        )} 查看相关命令的详细用法\r\n`
      )
    })

  // 解析用户执行命令传入参数
  program.parse(process.argv)
}
