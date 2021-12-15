import { rest } from 'msw';

export const handlers = [
  rest.get('https://api.backend.dev/user', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'John Doe',
        age: 23,
      }),
    );
  }),
];
