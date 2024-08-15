import { useCallback, useState } from 'react';
import { create } from 'middleware-axios';

export function App() {
  const [events, setEvents] = useState(() => []);

  const captureEvent = useCallback(event => {
    setEvents(list => [...list, event]);
  }, []);

  const onClick = useCallback(() => {
    setEvents([]);

    const client = create({
      baseURL: 'https://jsonplaceholder.typicode.com/',
      timeout: 5000,
    });

    client.use(async (config, next) => {
      captureEvent('[Middleware #1] started');

      const startTime = Date.now();
      const response = await next(config);

      captureEvent(`Request duration: ${Date.now() - startTime}ms`);
      captureEvent('[Middleware #1] finished');
    });

    client.use(async (config, next) => {
      captureEvent('[Middleware #2] started');

      const response = await next(config);

      captureEvent('[Middleware #2] finished');
    });

    client.use(async (config, next) => {
      captureEvent('[Middleware #3] started');

      const response = await next(config);

      captureEvent('[Middleware #3] finished');
    });

    async function run() {
      captureEvent('Before calling request');

      await client.get('/posts', {
        params: {
          userId: 2,
        },
      });

      captureEvent('After calling request');
    }

    run();
  }, [captureEvent]);

  return (
    <div>
      <h1>middleware-axios example</h1>

      <button onClick={onClick}>Fetch data</button>

      <div className='console'>
        {events.map((event, index) => (
          <div key={index} className='item'>
            {event}
          </div>
        ))}
      </div>
    </div>
  );
}
