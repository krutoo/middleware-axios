import cloneDeep from 'lodash/cloneDeep';
import { METHOD_NAMES } from './constants.js';
import { createBoundMethod } from './helpers.js';

/**
 * Creates a wrapper for Axios instance.
 * @param {Object} axiosInstance Axios instance.
 * @return {Object} Wrapper for Axios instance.
 */
export const wrapInstance = axiosInstance => {
  const baseConfig = cloneDeep(axiosInstance.defaults);
  const request = config => axiosInstance.request(config);

  // this methods object will be mutates by useMiddleware()
  const innerMethods = METHOD_NAMES.reduce(
    (kit, methodName) => {
      // by default each method is plain request()
      kit[methodName] = request;
      return kit;
    },
    {}
  );

  /*
   * Set of methods which always calls
   * actual method from "innerMethods".
   */
  const publicMethods = Object.keys(innerMethods)
    .reduce((kit, methodName) => {
      kit[methodName] = createBoundMethod(
        methodName,
        innerMethods,
        baseConfig
      );

      return kit;
    }, {});

  const useMiddleware = (methodName, middleware) => {
    if (METHOD_NAMES.includes(methodName)) {
      /*
       * save reference on original method
       * in scope of wrapped method
       */
      const originalMethod = innerMethods[methodName];
      const wrappedMethod = middleware(
        // aka next
        requestConfig => new Promise((resolve, reject) => {
          originalPromise = originalMethod(requestConfig);
          originalPromise.then(resolve, reject);
        })
      );
      let originalPromise = null;

      innerMethods[methodName] = async requestConfig => {
        await wrappedMethod(requestConfig);
        return originalPromise;
      };
    }

    return wrapper;
  };

  const wrapper = {
    axiosInstance,
    use: useMiddleware,
    request,
    ...publicMethods,
  };

  return wrapper;
};
