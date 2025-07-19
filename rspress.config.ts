import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans';
import ga from 'rspress-plugin-google-analytics';
import mermaid from 'rspress-plugin-mermaid';
import { pluginOpenGraph } from 'rsbuild-plugin-open-graph';

const siteUrl = 'https://salvo.rs/';

export default defineConfig({
  plugins: [pluginFontOpenSans(),ga({
    id: 'G-BYH5STQ7SS',
  },),mermaid(),
  pluginOpenGraph({
    title: 'Rspress',
    type: 'website',
    url: siteUrl,
    image: 'https://salvo.rs/images/logos/palpo.svg',
    description: 'Palpo Docs',
    twitter: {
      site: '@salvo',
      card: 'summary_large_image',
    },
  }),

],
  root: path.join(__dirname, 'docs'),
  title: 'Palpo',
  lang: 'en',
  // locales 为一个对象数组
  locales: [
    {
      lang: 'en',
      // 导航栏切换语言的标签
      label: 'English',
      title: 'salvo docs',
      description: 'Palpo - A matrix server implementation in Rust',
      editLink: {
        docRepoBaseUrl:
          'https://github.com/salvo-rs/website/tree/main/docs',
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
      title: 'Palpo',
      description: 'Palpo - 一个用 Rust 编写的 Matrix 服务器实现',
      editLink: {
        docRepoBaseUrl:
          'https://github.com/salvo-rs/website/tree/main/docs',
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
  icon: 'docs/public/images/icons/palpo.png',
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

