/**
 * Represents a result that can either be successful (`Ok`) or an error (`Err`).
 * @template T The type of the successful result.
 * @template E The type of the error.
 */
export interface BaseResult<T, E>
  extends Iterable<T extends Iterable<infer U> ? U : never> {
  /**
   * Checks if the result is successful (`Ok`).
   * @returns `true` if the result is successful, `false` otherwise.
   */
  isOk(): boolean;

  /**
   * Checks if the result is an error (`Err`).
   * @returns `true` if the result is an error, `false` otherwise.
   */
  isErr(): boolean;

  /**
   * Unwraps the successful result.
   * @returns The successful result.
   * @throws {Error} If the result is an error (`Err`).
   */
  unwrap(): T;

  /**
   * Unwrap the result or return a fallback value.
   * @param fallback The parameter to return if the result is an error.
   */
  unwrapOr<U>(fallback: U): T | U;

  /**
   * Unwraps the successful result or throws an error with a custom message.
   * @param {string} msg - The custom error message.
   * @returns The successful result.
   * @throws {Error} If the result is an error (`Err`).
   */
  expect(msg: string): T;
}