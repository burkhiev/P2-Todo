// [24.06.2022]
// popular random package has some
// issues to use it by import.

export default class Random {
  public static float(lowerBound: number, upperBound: number) {
    const errorMessage = 'lowerBound argument must be less or equal than upperBound';

    if (lowerBound > upperBound)
      throw new Error(errorMessage);

    const diff = upperBound - lowerBound;

    const rnd = Math.random();
    const result = lowerBound + rnd * diff;

    return result;
  }

  public static int(lowerBound: number, upperBound: number) {
    const errorMessage = 'lowerBound argument must be less or equal than upperBound at least 1';

    if ((upperBound - lowerBound) < 1)
      throw new Error(errorMessage);

    const lb = Math.ceil(lowerBound);
    const ub = Math.floor(upperBound);
    const floatResult = Random.float(lowerBound, upperBound);
    return Math.round(floatResult);
  }

  public static bool() {
    const value = Random.int(0, 1);

    return value > 0.5;
  }
}