import { ok, err, Result } from "../index";

describe("Ok Result", () => {
  const r = ok(42);

  test("isOk", () => {
    expect(r.isOk()).toBe(true);
  });

  test("isErr", () => {
    expect(r.isErr()).toBe(false);
  });

  test("unwrap", () => {
    expect(r.unwrap()).toBe(42);
  });

  test("unwrapOr", () => {
    expect(r.unwrapOr(0)).toBe(42);
  });

  test("expect", () => {
    expect(r.expect("Should not panic")).toBe(42);
    expect(r.expectErr).toThrow();
  });

  test("Iterating", () => {
    const iter = ok([1, 2, 3]);
    expect(iter[Symbol.iterator]().next()).not.toBeUndefined();
    expect(iter[Symbol.iterator]().next().value).toBe(1);
  });

  test("Mapping Value", () => {
    const newR = r.map((val) => val * 2);
    expect(newR.isOk()).toBe(true);
    expect(newR.unwrap()).toBe(84);
  });

  test("Mapping Error", () => {
    const newR = r.mapErr((val) => val + "!");
    expect(newR.isOk()).toBe(true);
    expect(newR.unwrap()).toBe(42);
  });

  test("Chaining", () => {
    const newR = r.andThen((val) => ok(val * 2));
    expect(newR.isOk()).toBe(true);
    expect(newR.unwrap()).toBe(84);
  });
});

describe("Err Result", () => {
  const r = err("Error");

  test("isOk", () => {
    expect(r.isOk()).toBe(false);
  });

  test("isErr", () => {
    expect(r.isErr()).toBe(true);
    expect(r.expectErr("No Error!")).toBe("Error");
  });

  test("unwrap", () => {
    expect(() => r.unwrap()).toThrow();
  });

  test("unwrapOr", () => {
    expect(r.unwrapOr(0)).toBe(0);
  });

  test("expect", () => {
    expect(() => r.expect("Should panic")).toThrow();
  });

  test("Iterating", () => {
    const iter = err("Error");
    expect(iter[Symbol.iterator]().next()).not.toBeUndefined();
    expect(iter[Symbol.iterator]().next().value).toBeUndefined();
  });

  test("Mapping Value", () => {
    const newR = r.map((val) => val * 2);
    expect(newR.isErr()).toBe(true);
    expect(newR.unwrap).toThrow();
  });

  test("Mapping Error", () => {
    const newR = r.mapErr((val) => val + "!");
    expect(newR.isErr()).toBe(true);
    expect(newR.value).toBe("Error!");
  });

  test("Chaining", () => {
    const newR = r.andThen((val) => ok(val * 2));
    expect(newR.isErr()).toBe(true);
    expect(newR.unwrap).toThrow();
  });
});

describe("Namespace Tests", () => {
  describe("Sync", () => {
    test("Wrapping an Ok", () => {
      expect(Result.wrap(() => 42).isOk()).toBe(true);
    });

    test("Wrapping an Err", () => {
      expect(
        Result.wrap(() => {
          throw new Error("Error");
        }).isErr(),
      ).toBe(true);
    });
  });

  describe("Async", () => {
    test("Wrapping an Ok", async () => {
      const res = await Result.wrapAsync(async () => 42);
      expect(res.isOk()).toBe(true);
    });

    test("Wrapping an Err", async () => {
      const res = await Result.wrapAsync(async () => {
        throw new Error("Error");
      });
      expect(res.isErr()).toBe(true);
    });
  });

  describe("Match", () => {
    test("Success", () => {
      const r = ok(42);
      Result.match(r, (okVal) => {
        expect(okVal).toBe(42);
      });
    });

    test("Error", () => {
      const r = err("Error");
      Result.match(r, undefined, (errVal) => {
        expect(errVal).toEqual("Error");
      });
    });

    test("Is result", () => {
      const r = ok(42);
      const e = err("Error");
      expect(Result.isResult(r)).toBe(true);
      expect(Result.isResult(e)).toBe(true);
      expect(Result.isResult(42)).toBe(false);
    });
  });
});
