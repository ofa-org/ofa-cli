import {getRepoList, getTagList} from '../http.js'
import inquirer from 'inquirer'
import ora from 'ora'
import util from 'util'
import downloadGitRepo from 'download-git-repo'
import path from 'path'
import chalk from 'chalk'
import ejs from 'ejs'
import fs from 'fs'

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message)
    // 开始加载动画
    spinner.start()

    try {
        // 执行传入方法 fn
        const result = await fn(...args)
        // 状态为修改为成功
        spinner.succeed()
        return result
    } catch (error) {
        // 状态为修改为失败
        spinner.fail('Request failed, refetch ...')
        throw error
    }
}

class Generator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name
        // 创建位置
        this.targetDir = targetDir
        // 对 download-git-repo 进行 promise 化改造
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    // 获取用户选择的模板
    // 1）从远程拉取模板数据
    // 2）用户选择自己新下载的模板名称
    // 3）return 用户选择的名称

    async getRepo() {
        // 1）从远程拉取模板数据
        const repoList = await wrapLoading(getRepoList, 'waiting fetch template')
        if (!repoList) return

        // 过滤我们需要的模板名称
        const repos = repoList
            .map((item) => item.name)
            // js 正则匹配-template 结尾的名称
            .filter((item) => /-template$/.test(item))
        console.log(11, repos)
        // 2）用户选择自己新下载的模板名称
        const {repo} = await inquirer.prompt([{
            name: 'repo',
            type: 'list',
            choices: repos,
            message: '请选择要创建的模板',
        }])

        // 3）return 用户选择的名称
        return repo
    }

    // 获取用户选择的版本
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    // 2）用户选择自己需要下载的 tag
    // 3）return 用户选择的 tag

    async getTag(repo) {
        // 1）基于 repo 结果，远程拉取对应的 tag 列表
        const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo)
        if (!tags) return

        // 过滤我们需要的 tag 名称
        const tagsList = tags.map((item) => item.name)

        // 2）用户选择自己需要下载的 tag
        const {tag} = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: '选择tag创建项目',
        })

        // 3）return 用户选择的 tag
        return tag
    }

    // 核心创建逻辑
    // 1）获取模板名称
    // 2）获取 tag 名称
    // 3）下载模板到模板目录
    // 4）模板使用提示
    async create() {
        // 1）获取模板名称
        const repo = await this.getRepo()

        // 2) 获取 tag 名称
        // const tag = await this.getTag(repo)

        // 3）下载模板到模板目录
        // await this.download(repo, tag)
        await this.download(repo)
        // this.targetDir
        this.ejsRender()
        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')
    }

    // 下载远程模板
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(repo, tag) {
        // 1）拼接下载地址
        const requestUrl = `ofa-org/${repo}${tag ? '#' + tag : ''}`

        // 2）调用下载方法
        await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            'waiting download template', // 加载提示信息
            requestUrl, // 参数1: 下载地址
            path.resolve(process.cwd(), this.targetDir)
        ) // 参数2: 创建位置
    }

    ejsRender() {
        // 1. 获取当前工作目录
        // 2. 拼接目标文件的路径
        const targetDir = path.join(this.targetDir)
        const filePath = path.join(targetDir, 'package.json')
        // 3. 读取文件内容
        const template = fs.readFileSync(filePath, 'utf-8')
        // 4. 渲染模板
        const result = ejs.render(template, {
            name: this.name,
        })


        fs.writeFile(filePath, result, 'utf8', (err) => {
            if (err) {
                console.error('写入文件失败:', err);
                return;
            }
            console.log('文件名称替换成功');
        });
    }
}

export default Generator
