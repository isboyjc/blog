import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



/**
 * @param { String } pathname
 * @param { Array } options.ignoreList 忽略列表，默认 []，示例：[ '/aaa/', '/xxx.md']
 * @param { Boolean } options.collapsible 是否可折叠，默认 true
 * @param { Boolean } options.collapsed 是否展开，默认 false
 * @param { Object } options.fileNameHash 文件名映射
 * @param { Function } options.beforeMountedSidebar Sidebar 挂载前回调，可处理具体文件夹、文件名
 * @param { Function } options.generateDirectoryName 生成目录文件名
 * @param { Function } options.generateDirectoryPath 生成目录相对地址
 * 
 * @description function description
 * @return {*}
 * @Date 2023-06-11 14:59:25
 * @Author isboyjc
 */
export default function getDirctSidebar(pathname, options) {
  const ignoreList = (options?.ignoreList || []).map(v => v.replace(/^\//, '').replace(/\.md$/, ''))
  const collapsible = options?.collapsible || true
  const collapsed = options?.collapsed || false
  const fileNameHash = options?.fileNameHash || {}


  const jsonData = getSidebar(pathname, {ignoreList, collapsible, collapsed, fileNameHash})

  options?.beforeMountedSidebar && options.beforeMountedSidebar(jsonData)

  const dirName = options?.generateDirectoryName || `${pathname}_dir`
  const dirPath = options?.generateDirectoryPath
  if(dirName && dirPath){
    fs.writeFileSync(path.resolve(__dirname, options?.generateDirectoryPath, `${dirName}.json`), JSON.stringify(jsonData, null,2));
  }
  return jsonData
}

/**
 * @param { String } pathname
 * @param { Array } options.ignoreList 忽略列表，默认 []，示例：[ '/aaa/', '/xxx.md']
 * @param { Boolean } options.collapsible 是否可折叠，默认 true
 * @param { Boolean } options.collapsed 是否展开，默认 false
 * @param { Object } options.fileNameHash 文件名映射
 * 
 * @description function description
 * @return {*}
 * @Date 2023-06-11 14:59:25
 * @Author isboyjc
 */
function getSidebar(pathname, options) {
  const p = path.resolve(__dirname, '../', pathname)
  if(!fs.existsSync(p)) return []

  const dirct = fs.readdirSync(p)

  return dirct.map(dir => {
    const filePath = path.join(p, dir)
    const stats = fs.statSync(filePath)
    if(stats.isDirectory()){
      // 目录
      const dirPath = `${pathname}/${dir}`
      return {
        text: options.fileNameHash[dirPath] || dir,
        collapsed: options.collapsed,
        collapsible: options.collapsible,
        key: dirPath,
        items: getDirctSidebar(dirPath, options)
      }
    }else{
      // 文件
      const file = fs.readFileSync(path.resolve(p, dir)).toString()
      let text = dir
      let lines = file.split('\n')
      const line = lines.shift()
      if(line.startsWith('# ')){
        text = line.replace('# ','')
      }else if(line.startsWith('---')){
        const index = lines.findIndex(v => v.startsWith('---'))
        lines = lines.slice(index + 1).filter(v => v)
        if(lines[0].startsWith('# ')){
          text = lines[0].replace('# ','')
        }
      }else{
        text = text.replace('.md','')
      }

      return {
        text,
        key: `/${pathname}/${dir.replace('.md','')}`,
        link: `/${pathname}/${dir.replace('.md','')}`
      }
    }
  }).filter(v => options.ignoreList.every(j => !v.key.includes(j) ))
}

/**
 * @param { String } str 
 * @description 判断字符串是否以 / 结尾，用以检验是否是文件夹
 * @return { Boolean }
 * @Date 2023-06-11 15:10:26
 * @Author isboyjc
 */
function isFolder(str){
  return /\/$/i.test(str)
}