import { create } from '../../src/index.ts';

const client = create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 5000,
});

client
  .use(async (config, next) => {
    Logger.print('middleware #1:before');
    const startTime = performance.now();
    const response = await next(config);
    Logger.print('request duration: ', performance.now() - startTime);
    Logger.print(
      'middleware #1:after, response.data.length:',
      response.data.length,
    );
  })
  .use(async (config, next) => {
    Logger.print('middleware #2:before');
    const response = await next(config);
    Logger.print(
      'middleware #2:after, response.data.length:',
      response.data.length,
    );
  })
  .use(async (config, next) => {
    Logger.print('middleware #3:before');
    const response = await next(config);
    Logger.print(
      'middleware #3:after, response.data.length:',
      response.data.length,
    );
  });

const Logger = {
  print(...message) {
    const item = document.createElement('div');

    item.className = 'item';
    item.textContent = message.join(' ');

    document.getElementById('console').append(item);

    console.log(message);
  },

  clear() {
    document.getElementById('console').innerHTML = '';
  },
};

async function performXHR() {
  Logger.print('before calling request');

  await client.get('/posts', {
    params: {
      userId: 2,
    },
  });

  Logger.print('after calling request');
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('perform-xhr').onclick = async function ({
    currentTarget,
  }) {
    const originalText = currentTarget.textContent;

    currentTarget.disabled = true;
    currentTarget.textContent = 'Loading...';
    Logger.clear();

    await new Promise(r => setTimeout(r, 200));

    await performXHR();

    await new Promise(r => setTimeout(r, 500));

    currentTarget.disabled = false;
    currentTarget.textContent = originalText;
  };
});
