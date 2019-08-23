import mergeConfig from 'axios/lib/core/mergeConfig.js';
import {
  isWithBody,
  createBoundMethod,
  mapWithBodyArgsToConfig,
  mapWithoutBodyArgsToConfig,
} from '../helpers.js';

describe('isWithBody()', () => {
  it('should return true for POST, PUT, PATCH', () => {
    [
      'POST',
      'PUT',
      'PATCH',
      'post',
      'put',
      'patch',
    ].forEach(methodName => {
      expect(isWithBody(methodName)).toBe(true);
    });
  });
  it('should return true for GET, DELETE, HEAD, OPTIONS', () => {
    [
      'get',
      'delete',
      'head',
      'options',
      'GET',
      'DELETE',
      'HEAD',
      'OPTIONS',
    ].forEach(methodName => {
      expect(isWithBody(methodName)).toBe(false);
    });
  });
});

describe('mapWithBodyArgsToConfig()', () => {
  it('should return object with properly structure', () => {
    expect(
      mapWithBodyArgsToConfig('get', [
        'posts/',
        { userId: 1 },
        { headers: { 'test-header': '123' } }
      ])
    ).toEqual({
      method: 'get',
      url: 'posts/',
      data: { userId: 1 },
      headers: { 'test-header': '123' },
    });

    expect(
      mapWithBodyArgsToConfig('post', [
        'todo/',
        { content: 'make awesome app' },
      ])
    ).toEqual({
      method: 'post',
      url: 'todo/',
      data: { content: 'make awesome app' },
    });
  });
});

describe('mapWithoutBodyArgsToConfig()', () => {
  it('should return object with properly structure', () => {
    expect(
      mapWithoutBodyArgsToConfig('get', [
        'todo/',
        { params: { userId: 234 } },
      ])
    ).toEqual({
      method: 'get',
      url: 'todo/',
      params: { userId: 234 },
    });
    expect(
      mapWithoutBodyArgsToConfig('options', [
        'user/',
      ])
    ).toEqual({
      method: 'options',
      url: 'user/',
    });
  });
});

describe('createBoundMethod()', () => {
  it('should return function', () => {
    expect(typeof createBoundMethod()).toBe('function');
  });
  it('should handle arguments properly for WITHOUT body methods', () => {
    const spy = jest.fn();
    const testMethods = {
      get: spy,
    };
    const testBaseConfig = {
      headers: { 'test-header': '123' },
    };
    const testGet = createBoundMethod(
      'get',
      testMethods,
      testBaseConfig
    );
    expect(spy).toHaveBeenCalledTimes(0);
    testGet('admins/', { headers: { 'second-header': '345' } });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual(
      mergeConfig(
        testBaseConfig,
        mapWithoutBodyArgsToConfig(
          'get',
          [
            'admins/',
            {
              headers: {
                'second-header': '345'
              },
            },
          ]
        )
      )
    );
  });
  it('should handle arguments properly for WITH body methods', () => {
    const spy = jest.fn();
    const testMethods = {
      post: spy,
    };
    const testBaseConfig = {
      headers: { 'test-header': '123' },
    };
    const testGet = createBoundMethod(
      'post',
      testMethods,
      testBaseConfig
    );
    expect(spy).toHaveBeenCalledTimes(0);
    testGet('admins/', { adminId: 123 }, { headers: { 'second-header': '345' } });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual(
      mergeConfig(
        testBaseConfig,
        mapWithBodyArgsToConfig(
          'post',
          [
            'admins/',
            {
              adminId: 123,
            },
            {
              headers: {
                'second-header': '345'
              },
            },
          ]
        )
      )
    );
  });
});
