import { wrapInstance } from '../wrap-instance.js';

const createAsyncFn = () => jest.fn(
  () => new Promise(resolve => {
    setTimeout(resolve, 1000);
  })
);

const fakeAxiosInstance = {
  request: createAsyncFn(),
  get: createAsyncFn(),
  post: createAsyncFn(),
  put: createAsyncFn(),
  patch: createAsyncFn(),
  options: createAsyncFn(),
  head: createAsyncFn(),
  delete: createAsyncFn(),
  defaults: {},
};

describe('wrapInstance()', () => {
  it('should returns object with properly structure', () => {
    const wrapper = wrapInstance(fakeAxiosInstance);
    expect(typeof wrapper.get).toBe('function');
    expect(typeof wrapper.post).toBe('function');
    expect(typeof wrapper.put).toBe('function');
    expect(typeof wrapper.patch).toBe('function');
    expect(typeof wrapper.options).toBe('function');
    expect(typeof wrapper.head).toBe('function');
    expect(typeof wrapper.delete).toBe('function');
    expect(wrapper.axiosInstance).toBe(fakeAxiosInstance);
  });
  it('wrapper should call original instance request() on each http-method calling', () => {
    const wrapper = wrapInstance(fakeAxiosInstance);
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(0);
    wrapper.get('users/');
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(1);
    wrapper.post('users/');
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(2);
    wrapper.put('users/');
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(3);
    wrapper.patch('users/');
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(4);
    wrapper.options('users/');
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(5);
    wrapper.head('users/');
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(6);
    wrapper.delete('users/');
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(7);
    wrapper.request({});
    expect(fakeAxiosInstance.request).toHaveBeenCalledTimes(8);
  });
  it('wrapper.use should wrap each request method', async () => {
    const spyBefore = jest.fn();
    const spyAfter = jest.fn();
    const wrapper = wrapInstance(fakeAxiosInstance);
    wrapper.use(async (requestConfig, next) => {
      spyBefore();
      await next(requestConfig);
      spyAfter();
    });

    expect(spyBefore).toHaveBeenCalledTimes(0);
    expect(spyAfter).toHaveBeenCalledTimes(0);
    await wrapper.get('articles/');
    expect(spyBefore).toHaveBeenCalledTimes(1);
    expect(spyAfter).toHaveBeenCalledTimes(1);
  });
});
