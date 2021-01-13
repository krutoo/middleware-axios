import { create } from 'axios';
import { wrapInstance } from '../src';

const wrappedApi = wrapInstance(create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 5000,
}));

wrappedApi
  .use(async (requestConfig, next) => {
    console.log('middleware #1:before');
    const startTime = performance.now();
    await next(requestConfig);
    console.log('request duration =', performance.now() - startTime);
    console.log('middleware #1:after');
  })
  .use(async (requestConfig, next) => {
    console.log('middleware #2:before');
    await next(requestConfig);
    console.log('middleware #2:after');
  })
  .use(async (requestConfig, next) => {
    console.log('middleware #3:before');
    await next(requestConfig);
    console.log('middleware #3:after');
  });

async function testWrapped () {
  await wrappedApi.get('/posts', {
    params: {
      userId: 2,
    },
  });
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('Demo started, click on page to load...');

  window.onclick = () => testWrapped();
});
