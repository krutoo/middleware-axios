# middleware-axios
Axios with express/koa like middleware

![Coverage branches](./badges/badge-branches.svg)
![Coverage statements](./badges/badge-statements.svg)

## Install

Using npm:

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
api.use(next => async requestConfig => {
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

### Instance methods

The available instance methods are listed below.
Each method works like in original axios instance.

##### axios.request(config)
##### axios.get(url[, config])
##### axios.delete(url[, config])
##### axios.head(url[, config])
##### axios.options(url[, config])
##### axios.post(url[, data[, config]])
##### axios.put(url[, data[, config]])
##### axios.patch(url[, data[, config]])
