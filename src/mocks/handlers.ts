import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.backend.dev/user', () => {
    return HttpResponse.json(
      {
        name: 'John Doe',
        age: 23,
      },
      { status: 200 },
    );
  }),
];
