export const WITH_BODY_METHODS = Object.freeze([
  'post',
  'put',
  'patch',
]);

export const WITHOUT_BODY_METHODS = Object.freeze([
  'get',
  'delete',
  'head',
  'options',
]);

export const METHOD_NAMES = Object.freeze([
  ...WITH_BODY_METHODS,
  ...WITHOUT_BODY_METHODS,
]);
