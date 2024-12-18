import { expect } from 'chai';
import { add, subtract, multiply, divide } from './math.mjs';

describe('Math Functions', () => {
  it('should add two numbers', () => {
    const result = add(2, 3);
    expect(result).to.equal(5);
  });

  it('should subtract two numbers', () => {
    const result = subtract(5, 3);
    expect(result).to.equal(2);
  });

  it('should multiply two numbers', () => {
    const result = multiply(4, 7);
    expect(result).to.equal(12);
  });

  it('should divide two numbers', () => {
    const result = divide(10, 2);
    expect(result).to.equal(5);
  });

  it('should throw an error when dividing by zero', () => {
    expect(() => divide(10, 0)).to.throw('Cannot divide by zero');
  });
});
