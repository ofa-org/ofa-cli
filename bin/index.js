#! /usr/bin/env node

import figlet from 'figlet';
import chalk from 'chalk';
import { Command } from 'commander';
import pkg from '../package.json' assert { type: "json" };
import create from '../lib/create.js'

const program = new Command();
program
    // 定义命令和参数
    .command('create <app-name>')
    .description('create a new project')
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        create(name, options)
    })


// 配置 config 命令
program
    .command('config [value]')
    .description('inspect and modify the config')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>')
    .option('-d, --delete <path>', 'delete option from config')
    .action((value, options) => {
        console.log('config', value, options)
    })

// 配置 ui 命令
program
    .command('ui')
    .description('start add open roc-cli ui')
    .option('-p, --port <port>', 'Port used for the UI Server')
    .action((option) => {
        console.log('ui', option)
    })


program
    // 配置版本号信息
    .version(`v${pkg.version}`)
    .usage('<command> [option]')
    .on('--help', () => {
        console.log('\r\n' + figlet.textSync('one for all', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 120,
            whitespaceBreak: false
        }));

        // 新增说明信息
        console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`)
    })

// 解析用户执行命令传入参数
program.parse(process.argv);
