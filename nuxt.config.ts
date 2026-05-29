// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  site: {
    url: 'https://0721.hk'
  },

  // TODO: Fix generated schema.org fields
  schemaOrg: {
    enabled: false
  },

  // TODO: Make custom OpenGraph templates
  ogImage: {
    enabled: false
  },

  // TODO: Check links in content
  linkChecker: {
    enabled: false
  },

  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/eslint',
    'nuxt-monaco-editor',
    '@nuxt/icon'
  ],

  icon: {
    mode: 'css',
    cssLayer: 'base'
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  css: ['~/assets/css/main.css', '~/assets/index.scss', '~/assets/theme.scss'],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['ms-store-badge'].includes(tag)
    }
  },

  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme: {
            // Default theme (same as single string)
            default: 'github-light'
          }
        }
      }
    }
  },

  compatibilityDate: '2025-11-18',

  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true // For heti
        }
      }
    },
    // server: {
    //   proxy: {
    //     // Set `PASTE_API` to `/api/paste` to use this
    //     '/api/paste': {
    //       target: 'https://paste.aosc.io',
    //       changeOrigin: true,
    //       rewrite:  (path) => path.replace(/^\/api\/paste/, '')
    //     },
    //     '/galleryFile': {
    //       target: 'https://aosc.io',
    //       changeOrigin: true
    //     },
    //     '/assets/news': {
    //       target: 'https://aosc.io',
    //       changeOrigin: true
    //     }
    //   }
    // }
  },

  nitro: {
    prerender: {
      // https://github.com/nuxt/nuxt/issues/15462#issuecomment-2995718316
      autoSubfolderIndex: true
    }
  },
});
