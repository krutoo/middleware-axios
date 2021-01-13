import mergeConfig from 'axios/lib/core/mergeConfig';
import { METHOD_NAMES } from './constants.js';
import { createBoundMethod } from './helpers.js';

/**
 * Creates a wrapper for Axios instance.
 * @param {Object} axiosInstance Axios instance.
 * @return {Object} Wrapper for Axios instance.
 */
export const wrapInstance = axiosInstance => {
  const baseConfig = mergeConfig({}, axiosInstance.defaults);
  const request = config => axiosInstance.request(config);

  // this methods object will be mutates by useMiddleware()
  const innerMethods = METHOD_NAMES.reduce((kit, methodName) => {
    // by default each method is plain request()
    kit[methodName] = config => kit.request(config);
    return kit;
  }, { request });

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

  const useMiddleware = middleware => {
    // save reference on original method in scope of wrapped method
    const originalMethod = innerMethods.request;

    innerMethods.request = async requestConfig => {
      let originalPromise = null;

      await middleware(
        requestConfig,

        // aka next
        nextConfig => new Promise((resolve, reject) => {
          originalPromise = originalMethod(nextConfig);
          originalPromise.then(resolve, reject);
        })
      );

      if (!originalPromise) {
        throw Error('Looks like one of your middleware functions is not called "next"');
      }

      return originalPromise;
    };

    return wrapper;
  };

  const wrapper = {
    axiosInstance,
    use: useMiddleware,
    ...publicMethods,
  };

  return wrapper;
};
