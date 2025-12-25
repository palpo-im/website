import { defineConfig } from '@rspress/core';
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans';
import ga from 'rspress-plugin-google-analytics';
import mermaid from 'rspress-plugin-mermaid';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';

const siteUrl = 'https://palpo.im/';

export default defineConfig({
  plugins: [pluginFontOpenSans(), ga({
    id: 'G-BYH5STQ7SS',
  },), mermaid(),
  pluginOpenGraph({
    title: 'Palpo - A matrix server implementation in Rust',
    type: 'website',
    url: siteUrl,
    image: 'https://palpo.im/images/logos/palpo.svg',
    description: 'Palpo - A matrix server implementation in Rust',
    // twitter: {
    //   site: '@palpo',
    //   card: 'summary_large_image',
    // },
  }),
  ],
  root: 'docs',
  title: 'Palpo',
  lang: 'en',
  // locales 为一个对象数组
  locales: [
    {
      lang: 'en',
      // 导航栏切换语言的标签
      label: 'English',
      title: 'Palpo - A matrix server implementation in Rust',
      description: 'Palpo - A matrix server implementation in Rust',
      editLink: {
        docRepoBaseUrl:
          'https://github.com/palpo-im/website/tree/main/docs',
        text: '📝 Edit this page on GitHub',
      },
      outlineTitle: 'On this page',
      outline: true,
      lastUpdated: true,
      lastUpdatedText: 'Last Updated',
      prevPageText: 'Previous Page',
      nextPageText: 'Next Page',
      searchPlaceholderText: 'Search Docs',
      searchNoResultsText: 'No results found',
      searchSuggestedQueryText: 'Try searching for',
    },
    {
      lang: 'zh-hans',
      label: '简体中文',
      title: 'Palpo - 一个用 Rust 编写的 Matrix 服务器实现',
      description: 'Palpo - 一个用 Rust 编写的 Matrix 服务器实现',
      editLink: {
        docRepoBaseUrl:
          'https://github.com/palpo-im/website/tree/main/docs',
        text: '📝 在 GitHub 上编辑此页',
      },
      outlineTitle: '在本页上',
      outline: true,
      lastUpdated: true,
      lastUpdatedText: '最后更新',
      prevPageText: '上一页',
      nextPageText: '下一页',
      searchPlaceholderText: '搜索文档',
      searchNoResultsText: '未找到结果',
      searchSuggestedQueryText: '尝试搜索',
    },
  ],
  icon: '/images/icons/palpo.png',
  logo: {
    light: '/images/logos/palpo.svg',
    dark: '/images/logos/palpo.svg',
  },
  // locales 为一个对象数组
  themeConfig: {
    hideNavbar: "auto",
    enableContentAnimation: true,
    enableScrollToTop: true,
    overview: {
      filterNameText: 'Filter',
      filterPlaceholderText: 'Enter keyword',
      filterNoResultText: 'No matching API found',
    },
    footer: {
      message: 'Apache 2.0 Licensed | Copyright © 2019-present Palpo Team',
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/palpo-im/palpo',
      },
    ],
  },
});

