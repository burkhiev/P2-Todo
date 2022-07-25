export default class OutOfRangeError extends Error {
  constructor(message: string) {
    super(`Out of range error. ${message}`);
  }
}
