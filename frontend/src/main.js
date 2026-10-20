import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/index.js';
import '@/styles/global.css';
import { revealDirective } from '@/directives/reveal.js';
import { SITE_NAME, SITE_URL } from '@/config/siteInfo.js';

document.title = `${SITE_NAME} | Home Organization & Kitchen Storage`;
document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', SITE_NAME);
document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${SITE_URL}/`);
document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${SITE_URL}/`);

const app = createApp(App);
app.directive('reveal', revealDirective);
app.use(router).mount('#app');
