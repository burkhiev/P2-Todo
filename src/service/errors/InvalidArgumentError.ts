export default class InvalidArgumentError extends Error {
  constructor(message: string) {
    super(`Invalid argument error. ${message}`);
  }
}
