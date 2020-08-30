const { getAuthorIds } = require('../utils/fetchers');

test('no explores', () => {
  expect(getAuthorIds("{}")).toEqual([]);
});

test('one explore, no fields', () => {
  expect(getAuthorIds("{\"foo\":{}}")).toEqual([]);
});

test('one explore, one field, no comments', () => {
  expect(getAuthorIds("{\"foo\":{\"foo.bar\":[]}}")).toEqual([]);
});

test('one explore, one field, one comment', () => {
  expect(getAuthorIds("{\"foo\":{\"foo.bar\":[{\"author\":1}]}}")).toEqual([1]);
});

test('one explore, one field, two comments, repeated author', () => {
  expect(getAuthorIds("{\"foo\":{\"foo.bar\":[{\"author\":1},{\"author\":1}]}}")).toEqual([1]);
});

test('one explore, one field, two comments, distinct authors', () => {
  expect(getAuthorIds("{\"foo\":{\"foo.bar\":[{\"author\":1},{\"author\":5}]}}")).toEqual([1,5]);
});

test('one explore, two fields, four comments, distinct authors', () => {
  expect(getAuthorIds("{\"foo\":{\"foo.bar\":[{\"author\":1},{\"author\":5}],\"foo.baz\":[{\"author\":3},{\"author\":2}]}}")).toEqual([1,5,3,2]);
});

test('one explore, two fields, four comments, repeated authors', () => {
  expect(getAuthorIds("{\"foo\":{\"foo.bar\":[{\"author\":1},{\"author\":1}],\"foo.baz\":[{\"author\":1},{\"author\":1}]}}")).toEqual([1]);
});

test('two explores, three fields, five comments, distinct authors', () => {
  expect(getAuthorIds("{\"foo\":{\"foo.bar\":[{\"author\":1},{\"author\":5}],\"foo.baz\":[{\"author\":3},{\"author\":2}]},\"book\":{\"book.caw\":[{\"author\":9},{\"author\":8}]}}")).toEqual([1,5,3,2,9,8]);
});
