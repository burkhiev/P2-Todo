// [24.06.2022]
// popular random package has some
// issues to use it by import.

export default class Random {
  public static float(lowerBound: number, upperBound: number) {
    const errorMessage = 'lowerBound argument must be less or equal than upperBound';

    if (lowerBound > upperBound) throw new Error(errorMessage);

    const diff = upperBound - lowerBound;

    const rnd = Math.random();
    const result = lowerBound + rnd * diff;

    return result;
  }

  public static int(lowerBound: number, upperBound: number) {
    if ((upperBound - lowerBound) < 1) {
      return Math.floor(upperBound);
    }

    const floatResult = Random.float(lowerBound, upperBound);

    let result = Math.round(floatResult);
    if (result < lowerBound) {
      result = Math.ceil(lowerBound);
    }

    if (result > upperBound) {
      result = Math.floor(upperBound);
    }

    return result;
  }

  public static bool() {
    const value = Random.int(0, 1);

    return value > 0.5;
  }
}
