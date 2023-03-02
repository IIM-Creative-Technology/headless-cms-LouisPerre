// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/strapi'],
    strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337',
        prefix: '/api',
        version: 'v4',
    },
    
    css: ['~/assets/css/main.scss', '@fortawesome/fontawesome-svg-core/styles.css'],
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
    }
})
