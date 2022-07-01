export default class MathService {
  public static countOfFractionalPartNumbers(value: number) {
    if (value === undefined || value === null) {
      throw new Error('Invalid operation error. value is undefined or null.');
    }

    return (value.toString().includes('.')) ? (value.toString().split('.').pop()!.length) : (0);
  }
}
