# axios-middleware
Axios with express/koa like middleware

## Install

Using npm (coming soon):

```bash
npm install --save axios-middleware
```

Using yarn:

```bash
yarn add axios-middleware
```

## Usage

Wrap axios instance (interface will be saved):

```javascript
import { create } from 'axios';
import { wrapInstance } from 'axios-middleware';

// create wrapped instance
const api = wrapInstance(create({
  baseURL: 'https://some-domain.com/api/',
}));

// add middleware if you want
api.use('get', next => async requestConfig => {
  // do something before request start...
  await next(requestConfig); // calling next is required
  // ...and do something after
});

// use almost like normal axios
api.get('/user/12345').then(response => {
  console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
});

console.log(api.axiosInstance); // pure instance

```
