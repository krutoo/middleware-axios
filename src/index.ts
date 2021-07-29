import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type MethodName =
| 'get'
| 'delete'
| 'head'
| 'options'
| 'post'
| 'put'
| 'patch';

export interface Next <R> {
  (config: AxiosRequestConfig): Promise<AxiosResponse<R>>
}

export interface Middleware <R> {
  (config: AxiosRequestConfig, next: Next<R>): Promise<void>
}

export interface AxiosInstanceWrapper {
  request: AxiosInstance['request']
  get: AxiosInstance['get']
  delete: AxiosInstance['delete']
  head: AxiosInstance['head']
  options: AxiosInstance['options']
  post: AxiosInstance['post']
  put: AxiosInstance['put']
  patch: AxiosInstance['patch']

  axiosInstance: AxiosInstance

  use: <R = any>(middleware: Middleware<R>) => AxiosInstanceWrapper
}

const ArgsToConfig = {
  withBody: (
    method: MethodName,
    [url, data, config]: [url?: string, data?: any, config?: AxiosRequestConfig]
  ): AxiosRequestConfig => ({
    url,
    method,
    data,
    ...config,
  }),
  withoutBody: (
    method: MethodName,
    [url, config]: [url?: string, config?: AxiosRequestConfig]
  ): AxiosRequestConfig => ({
    url,
    method,
    ...config,
  }),
};

export const create = (config: AxiosRequestConfig): AxiosInstanceWrapper => {
  const instance = axios.create(config);

  let request = instance.request.bind(instance);

  const publicApi: Pick<AxiosInstance, MethodName | 'request'> = {
    request: (args) => request(args),
    get: (...args) => request(ArgsToConfig.withoutBody('get', args)),
    delete: (...args) => request(ArgsToConfig.withoutBody('delete', args)),
    head: (...args) => request(ArgsToConfig.withoutBody('head', args)),
    options: (...args) => request(ArgsToConfig.withoutBody('options', args)),
    post: (...args) => request(ArgsToConfig.withBody('post', args)),
    put: (...args) => request(ArgsToConfig.withBody('put', args)),
    patch: (...args) => request(ArgsToConfig.withBody('patch', args)),
  };

  const useMiddleware = <M> (middleware: Middleware<M>): AxiosInstanceWrapper => {
    const wrapped = request;

    request = async function <T = any, R = AxiosResponse<T>> (config: AxiosRequestConfig) {
      let promise: Promise<R> | undefined;

      await middleware(config, nextConfig => {
        promise = wrapped(nextConfig);

        // IMPORTANT: returns original promise here and don`t create another
        return promise as any;
      });

      if (!promise) {
        throw Error('Looks like one of your middleware functions is not called "next"');
      }

      // IMPORTANT: returns original promise here and don`t create another
      return promise;
    };

    return wrapper;
  };

  const wrapper: AxiosInstanceWrapper = {
    ...publicApi,
    axiosInstance: instance,
    use: useMiddleware,
  };

  return wrapper;
};
