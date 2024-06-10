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

  /**
   * Unwraps the error or throws if the value is Ok.
   * @param msg the message to throw if the value is Ok
   */
  expectErr(msg: string): E;

  /**
   * Applies a mapping function to the successful result.
   * @template U The type of the mapped result.
   * @param {Function} mapper The mapping function.
   * @returns A new `Result` with the mapped result.
   */
  map<U>(mapper: (val: T) => U): Result<U, E>;

  /**
   * Applies a mapping function to the error.
   * @template U The type of the mapped error.
   * @param {Function} mapper The mapping function.
   * @returns A new `Result` with the mapped error.
   */
  mapErr<U>(mapper: (val: E) => U): Result<T, U>;

  /**
   * Calls `mapper` if the result is successful, otherwise returns the error.
   * Can be used to chain multiple `Result` operations.
   * @param mapper 
   */
  andThen<T2>(mapper: (val: T) => OkImpl<T2>): Result<T2, E>;
  andThen<E2>(mapper: (val: T) => ErrImpl<E2>): Result<T, E | E2>;
  andThen<T2, E2>(mapper: (val: T) => Result<T2, E2>): Result<T2, E | E2>;
  andThen<T2, E2>(mapper: (val: T) => Result<T2, E2>): Result<T2, E | E2>;
}

class OkImpl<T> implements BaseResult<T, never> {
  private readonly ok!: true;
  private readonly err!: false;
  readonly value!: T;

  constructor(value: T) {
    if (!(this instanceof OkImpl)) {
      return new OkImpl(value);
    }
    this.ok = true;
    this.err = false;
    this.value = value;
  }

  [Symbol.iterator](): Iterator<T extends Iterable<infer U> ? U : never> {
    const obj = Object(this.value) as Iterable<any>;

    return Symbol.iterator in obj
      ? obj[Symbol.iterator]()
      : {
          next(): IteratorResult<never, never> {
            return { done: true, value: undefined! };
          },
        };
  }

  isOk(): boolean {
    return this.ok;
  }

  isErr(): boolean {
    return this.err;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr<U>(_fallback: U): T | U {
    return this.value;
  }

  expect(_msg: string): T {
    return this.value;
  }

  expectErr(msg: string): never {
    throw new Error(msg);
  }

  map<T2>(mapper: (val: T) => T2): OkImpl<T2> {
    return ok(mapper(this.value));
  }

  mapErr(_mapper: unknown): OkImpl<T> {
    return this;
  }

  andThen<T2>(mapper: (val: T) => OkImpl<T2>): OkImpl<T2>;
  andThen<E2>(mapper: (val: T) => ErrImpl<E2>): Result<T, E2>;
  andThen<T2, E2>(mapper: (val: T) => Result<T2, E2>): Result<T2, E2>;
  andThen<T2, E2>(mapper: (val: T) => Result<T2, E2>): Result<T2, E2> {
    return mapper(this.value);
  }
}

class ErrImpl<E> implements BaseResult<never, E> {
  private readonly ok!: false;
  private readonly err!: true;
  readonly value!: E;

  constructor(value: E) {
    if (!(this instanceof ErrImpl)) {
      return new ErrImpl(value);
    }
    this.ok = false;
    this.err = true;
    this.value = value;
  }

  [Symbol.iterator](): Iterator<never, never, any> {
    return {
      next(): IteratorResult<never, never> {
        return { done: true, value: undefined! };
      },
    };
  }

  isOk(): boolean {
    return this.ok;
  }

  isErr(): boolean {
    return this.err;
  }

  unwrap(): never {
    throw new Error(`Tried to unwrap an Err:\n${this.value}`);
  }

  unwrapOr<U>(fallback: U): U {
    return fallback;
  }

  expect(msg: string): never {
    throw new Error(`${msg} - Error:\n${this.value}`);
  }

  expectErr(_msg: string): E {
    return this.value;
  }

  map(_mapper: unknown): ErrImpl<E> {
    return this;
  }

  mapErr<E2>(mapper: (err: E) => E2): ErrImpl<E2> {
    return err(mapper(this.value));
  }

  andThen(_op: unknown): ErrImpl<E> {
    return this;
  }
}

export const err = <E>(val: E) => new ErrImpl(val);
export const ok = <T>(val: T) => new OkImpl(val);
export type Result<T, E> = OkImpl<T> | ErrImpl<E>;

export namespace Result {
  export function wrap<T, E = unknown>(op: () => T): Result<T, E> {
    try {
      const val = op();
      return ok(val);
    } catch (e) {
      return err(e as E);
    }
  }

  export async function wrapAsync<T, E = unknown>(
    op: () => Promise<T>
  ): Promise<Result<T, E>> {
    try {
      const val = await op();
      return ok(val);
    } catch (e) {
      return err(e as E);
    }
  }

  export function isResult<T, E>(val: any): val is Result<T, E> {
    return val instanceof OkImpl || val instanceof ErrImpl;
  }

  export function match<T, E>(
    result: Result<T, E>,
    okFn?: (result: T) => any,
    errFn?: (error: E) => any
  ) {
    if (result.isOk()) {
      return okFn?.(result.unwrap());
    } else {
      return errFn?.(result.value as E);
    }
  }
}
