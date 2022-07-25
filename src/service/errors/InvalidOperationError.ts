export default class InvalidOperationError extends Error {
  constructor(message: string) {
    super(`Invalid operation error. ${message}`);
  }
}
