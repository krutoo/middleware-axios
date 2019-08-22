import cloneDeep from 'lodash/cloneDeep';
import mergeConfig from 'axios/lib/core/mergeConfig.js';

const withBodyMethods = Object.freeze([
  'post',
  'put',
  'patch',
]);

const withoutBodyMethods = Object.freeze([
  'get',
  'delete',
  'head',
  'options',
]);

const methodNames = Object.freeze([
  ...withBodyMethods,
  ...withoutBodyMethods,
]);

const isWithBody = methodName => withBodyMethods.includes(
  methodName
);

export const wrapInstance = axiosInstance => {
  const baseConfig = cloneDeep(axiosInstance.defaults);
  const request = config => axiosInstance.request(config);

  // this methods object will be mutates by useMiddleware()
  const innerMethods = methodNames.reduce(
    (kit, methodName) => {
      kit[methodName] = request;
      return kit;
    },
    {}
  );

  /*
   * Set of methods which always calls
   * actual method from "methods".
   * It set is for library users.
   */
  const publicMethods = Object.keys(innerMethods)
    .reduce((kit, methodName) => {
      const mapArgsToConfig = isWithBody(methodName)
        ? mapWithBodyArgsToConfig
        : mapWithoutBodyArgsToConfig;

      const boundMethod = (...args) => {
        const originalMethod = innerMethods[methodName];

        return originalMethod(mergeConfig(
          baseConfig,
          mapArgsToConfig(methodName, args)
        ));
      };

      kit[methodName] = boundMethod;

      return kit;
    }, {});

  const useMiddleware = (methodName, middleware) => {
    if (methodNames.includes(methodName)) {
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

const mapWithBodyArgsToConfig = (method, [
  url,
  data,
  axiosConfig = {},
]) => ({
  method,
  url,
  data,
  ...axiosConfig,
});

const mapWithoutBodyArgsToConfig = (method, [
  url,
  axiosConfig = {},
]) => ({
  method,
  url,
  ...axiosConfig,
});
