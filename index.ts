import { ok, Result } from "./src/results";

export * from "./src/results";

const result: Result<number, string> = ok(2);

const newResult = result.andThen((val) => {
  return ok(val + 2);
});

console.log(newResult.unwrap());
