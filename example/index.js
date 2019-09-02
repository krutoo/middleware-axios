import 'babel-polyfill';
import { create } from 'axios';
import { wrapInstance } from '../src/index.js';


const pureApi = create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 5000,
});

const wrappedApi = wrapInstance(create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 5000,
}));

wrappedApi
  .use(async (requestConfig, next) => {
    console.log('start middleware #1');
    const startTime = performance.now();
    await next(requestConfig);
    console.log('request duration =', performance.now() - startTime);
    console.log('finish middleware #1');
  })
  .use(async (requestConfig, next) => {
    console.log('start middleware #2');
    await next(requestConfig);
    console.log('finish middleware #2');
  })
  .use(async (requestConfig, next) => {
    console.log('start middleware #3');
    await next(requestConfig);
    console.log('finish middleware #3');
  });

async function testWrapped () {
  await wrappedApi.get(
    '/posts',
    {
      params: {
        userId: 2,
      },
    }
  );
}

async function testPure () {
  const startTime = performance.now();
  await pureApi.get('/todos/1');
  console.log('duration =', performance.now() - startTime);
}

window.addEventListener('click', () => {
  console.log('Demo started, click on page to load...');
  testWrapped();
});
