import { BaseResult } from "./result";

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
    okFn?: (result: OkImpl<T>) => any,
    errFn?: (stack: ErrImpl<E>) => any
  ) {
    if (result.isOk()) {
      return okFn?.(result as OkImpl<T>);
    } else {
      return errFn?.(result as ErrImpl<E>);
    }
  }
}
