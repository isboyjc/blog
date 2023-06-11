/*
 * @LastEditTime: 2023-06-11 23:28:38
 * @Description: ...
 * @Date: 2023-06-08 18:59:10
 * @Author: isboyjc
 * @LastEditors: isboyjc
 */
/*
 * @LastEditTime: 2023-06-11 14:06:35
 * @Description: ...
 * @Date: 2023-02-15 01:12:53
 * @Author: isboyjc
 * @LastEditors: isboyjc
 */
import { defineConfigWithTheme,defineConfig } from 'vitepress'
// import { withMermaid } from "vitepress-plugin-mermaid";
import getDirctSidebar from "./sidebar"

export default defineConfig({
  title: '不正经的前端',
  description: '是前端，又不只是前端，分享前端开发的点滴！',
  head: [
    ['link', { rel: 'icon', href: 'https://qiniu.isboyjc.com/picgo/202302150128528.ico', type: 'image/ico' }],
    // ['link', { rel: 'alternate icon', href: 'https://cdn.jsdelivr.net/gh/isboyjc/static/woniu.png', type: 'image/png', sizes: '16x16' }],
  ],
  // 清洁路由 - 删除.html后缀，需服务器支持
  // cleanUrls: true,
  // 路由重写
  rewrites: {
    // 'packages/:pkg/src/(.*)': ':pkg/index.md'
  },
  themeConfig: {
    outline: [2, 6],
    outlineTitle: '快看这页儿写了啥...',
    returnToTopLabel: '',
    
    me: {
      logo: "/logo.jpg",
      gongzhonghao: "/gongzhonghao.jpeg"
    },
    
    // logo: 'https://qiniu.isboyjc.com/picgo/202303141702350.png',
    logo: '/logo.jpg',

    nav: [
      // { text: '🔥硬核JS', link: '/hardcorejs/' },
      { 
        text: '🔥面试', 
        activeMatch: `^/interview/`,
        items: [
          { text: '快速了解', link: '/interview/' },
          { text: 'HTML', link: '/interview/01html/010base/010010_stylization' },
          { 
            text: 'JavaScript', 
            // link: '/interview/03javascript/core/010base/010010_stronglytype_and_weaklytype'
            items: [
              {
                text: '理论题', 
                link: '/interview/03javascript/core/010base/010010_stronglytype_and_weaklytype' 
              },
              {
                text: '手写题', 
                link: '/interview/03javascript/write/0010_js_write_map' 
              },
              {
                text: '输出题', 
                link: '/interview/03javascript/output/010_js_op' 
              }
            ]
          },
          { text: 'CSS', link: '/interview/02css/010base/010010_css_load' },
          // { text: 'Vue', link: '/interview/vue/vue' },
          // { text: 'React', link: '/interview/react/react' },
          // { text: '其他', link: '/interview/other/other' }
        ],
      },
      { text: 'Vue3+Vite实战', link: '/vue3vitepro/' },
      { text: 'TOOLSDOG', link: 'http://toolsdog.isboyjc.com' },
      { text: '关于我', link: '/about' },
    ],

    socialLinks: [
      // { icon: 'discord', link: 'https://discord.gg/gtTAKTYGaN' },
      {
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="32" viewBox="0 0 496 512"><path fill="" d="M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7l-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1l114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4l-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"/></svg>`
        }, 
        link: "https://t.me/+dcksy40MdTM4OWFl"
      },
      // { icon: 'twitter', link: 'https://twitter.com/isboyjc' },
      { 
        icon: {
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64"><path fill="" d="M32 0C14 0 0 14 0 32c0 21 19 30 22 30c2 0 2-1 2-2v-5c-7 2-10-2-11-5c0 0 0-1-2-3c-1-1-5-3-1-3c3 0 5 4 5 4c3 4 7 3 9 2c0-2 2-4 2-4c-8-1-14-4-14-15c0-4 1-7 3-9c0 0-2-4 0-9c0 0 5 0 9 4c3-2 13-2 16 0c4-4 9-4 9-4c2 7 0 9 0 9c2 2 3 5 3 9c0 11-7 14-14 15c1 1 2 3 2 6v8c0 1 0 2 2 2c3 0 22-9 22-30C64 14 50 0 32 0Z"/></svg>`
        }, 
        link: 'https://github.com/isboyjc/blog' 
      },
    ],

    lastUpdatedText:"更新时间",

    editLink: {
      pattern: 'https://github.com/isboyjc/blog/tree/master/docs/:path',
      text: '编辑页面'
    },

    sidebar: {
      "/hardcorejs":[
        {
          text: '硬核JS',
          collapsible: true,
          collapsed: false,
          items: [
            {
              text: '快速了解', link: '/hardcorejs/index'
            },
          ]
        },
      ],

      "/vue3vitepro":[
        {
          text: 'Vue3+Vite实战',
          collapsible: true,
          collapsed: false,
          items: [
            {
              text: '快速了解', link: '/vue3vitepro/'
            },
            ...getDirctSidebar('vue3vitepro/core', {
              ignoreList: [],
              collapsed: true,
              fileNameHash: {
                'vue3vitepro/index': '快速了解',
                "vue3vitepro/core/01.init": '准备工作',
                "vue3vitepro/core/02.layout": '多布局',
                "vue3vitepro/core/03.mode": '模式切换',
                "vue3vitepro/core/04.regular": '正则校验工具',
                'vue3vitepro/other': 'ING...',
              }
            }),
            {
              text: 'ING...', link: '/vue3vitepro/other'
            }
          ]
        },
      ],

      "/interview": [
        {
          text: '快速了解', link: '/interview/index.md'
        },
        ...getDirctSidebar('interview', {
          ignoreList: [
            'interview/index',
            'interview/vue', 
            'interview/react', 
            'interview/webpack', 
            'interview/other', 
            'interview/algorithm'
          ],
          collapsed: true,
          fileNameHash: {
            'interview/01html': 'HTML',
            'interview/01html/010base': '基础',
            'interview/01html/020labels_attributes': '标签&属性',
            'interview/01html/030form': '表单',
            'interview/01html/040other': '其他',
            
            'interview/02css': 'CSS',
            'interview/02css/010base': '基础',
            'interview/02css/020selector': '选择器',
            'interview/02css/030structure_stacking': '结构&层叠',
            'interview/02css/040value_unit': '值&单位',
            'interview/02css/050font_text': '字体&文本',
            'interview/02css/060visual_formatting': '视觉格式化',
            'interview/02css/070box': '盒子',
            'interview/02css/080float': '浮动',
            'interview/02css/090postion': '定位',
            'interview/02css/100layout': '布局',
            'interview/02css/110browser': '浏览器',
            'interview/02css/120other': '其他',
  
            'interview/03javascript': 'JavaScript',
            'interview/03javascript/core': '理论题',
            'interview/03javascript/core/010base': '基础',
            'interview/03javascript/core/020datatype': '数据类型',
            'interview/03javascript/core/030object': '对象',
            'interview/03javascript/core/040array': '数组',
            'interview/03javascript/core/050function': '函数',
            'interview/03javascript/core/060asynchronous': '异步',
            'interview/03javascript/core/070scope': '作用域',
            'interview/03javascript/core/080this': 'This',
            'interview/03javascript/core/090prototype': '原型',
            'interview/03javascript/core/100eventloop': '事件循环',
            'interview/03javascript/core/110browser': '浏览器对象',
            'interview/03javascript/core/120other': '其他',
            'interview/03javascript/write': '手写题',
            'interview/03javascript/output': '输出题',
  
            'interview/vue': 'Vue',
            'interview/react': 'React',
            'interview/webpack': 'Webpack',
            'interview/algorithm': '算法',
            'interview/other': '其他'
          },
          generateDirectoryName: 'interview_dir',
          generateDirectoryPath: '../'
        })
      ],
      '/': [
        // {
        //   text:"Vue3+Vite实战",
        //   collapsible: true,
        //   collapsed: true,
        //   items: getDirctSidebar('vue3vitepro')
        // }
      ],
    },

    footer: {
      message: '不正经的前端',
      copyright: 'Copyright © 2019-present isboyjc ｜ 京ICP备2022012153号-1'
    },

    search: {
      search: {
        provider: 'local',
        options: {
          locales: {
            zh: {
              translations: {
                button: {
                  buttonText: '搜索文档',
                  buttonAriaLabel: '搜索文档'
                },
                modal: {
                  noResultsText: '无法找到相关结果',
                  resetButtonTitle: '清除查询条件',
                  footer: {
                    selectText: '选择',
                    navigateText: '切换'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})