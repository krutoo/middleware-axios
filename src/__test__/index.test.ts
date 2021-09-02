import { create } from '..';

test('middleware should works', async () => {
  const api = create({
    baseURL: 'https://api.backend.dev',
  });

  const log: string[] = [];

  api.use(async (config, next, defaults) => {
    log.push('middleware:start');
    log.push(`url: ${config.url}`);
    log.push(`baseURL: ${defaults.baseURL}`);

    await next(config);

    log.push('middleware:end');
  });

  const response = await api.get('/user');

  expect(response.data).toEqual({
    name: 'John Doe',
    age: 23,
  });

  expect(log).toEqual([
    'middleware:start',
    'url: /user',
    'baseURL: https://api.backend.dev',
    'middleware:end',
  ]);
});
