const sum = require('../src/sum.js');

//uses Object.is to check for exact equality
test('adds 1+2 to equal 3', () => {
  expect(sum(1,2)).toBe(3);
});

// chesk for an value of an object (recursively checks for every field of an object or array)
test('object assignemnt', () => {
  const data = { one: 1 };
  data['two'] = 2;
  expect(data).toEqual({one:1, two:2});
});

//opposite matching using not
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a+b).not.toBe(0);
    }
  }
});

test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

//notice that undefined and null is treated falsy
// same way as 'if ( !account )'
test('undefined', () => {
  const u = undefined;
  expect(u).not.toBeNull();
  expect(u).not.toBeDefined();
  expect(u).toBeUndefined();
  expect(u).not.toBeTruthy();
  expect(u).toBeFalsy();
});

test('zero', () => {
  const z = 0; 
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});

test('one', () => {
  const o = 1; 
  expect(o).not.toBeNull();
  expect(o).toBeDefined();
  expect(o).not.toBeUndefined();
  expect(o).toBeTruthy();
  expect(o).not.toBeFalsy();
});


test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4);

  expect(value).toBe(4);
  expect(value).toEqual(4);
});

test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  expect(value).toBeCloseTo(0.3);
});

test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is ott in otto', () => {
  expect('otto').toMatch(/ott/);
});


// check if array or iterable contains a particular item using toContain
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'milk',
];

test('test shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});

function compileAndroidCode() {
  throw new Error('you are using the wrong JDK!');
}

test('comping android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);
  
  // You can also use a string that must be contained in the error message or a regexp
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrow(/JDK/);

  // Or you can match an exact error message using a regexp like below
  //expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/); // Test pass
});