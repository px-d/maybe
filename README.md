# Maybe

Typescript implementation for Result types very similar to rust.

## Currently implemented:

- `unwrap()`
- `unwrapOr()`
- `expect()`
- `expectErr()`
- `map()`
- `mapErr()`
- `andThen()`

#### Namespace:

- `Result.wrap()`
- `Result.wrapAsync()`
- `Result.isResult()`
- `Result.match()`

## Usage

### `unwrap()`

```ts
const response: Result<number, string> = ok(22);
response.unwrap(); // = 22
```

### `unwrapOr()`

```ts
const response: Result<number, string> = err("Some Error");
response.unwrapOr(10); // = 10
```

### `expect()`

```ts
const response: Result<number, string> = err("Error!");
response.expect("Could not retrieve number"); // = ouputs the provided Error Message
```

### `expectErr()`

```ts
const response: Result<number, string> = err("Error!");
response.expectErr("No Error!"); // = returns the string "Error!"
```

### `map()`

```ts
const result = ok([1, 2, 3]);
const mapped = result.map((arr) => arr.map((n) => n * 2)); // => [2, 4, 6]
```

### `mapErr()`

```ts
const result = err("error");
const nResult = result.mapErr((err) => {
  return err + "!";
}); // => nResult.value === "error!"
```

### `andThen()`

```ts
const result: Result<number, string> = ok(2);

const newResult = result.andThen((val) => {
  return ok(val + 2);
}); // => new value is 4
```

## Namespace Functions

### `Result.isResult`

used to check if an object is of type result (either ErrImpl or OkImpl)

### `Result.wrap()`

This function a function as an argument and resolves the function into a Result. If the function should fail, the Result would be an `error`.

```ts
// Happy case
const result: Result<number, string> = Result.wrap(() => {
  return 1;
});
```

```ts
// Not so happy case
const result: Result<number, string> Result.wrap(()=>{
  throw new Error("Type Error")
});
```

### `Result.wrapAsync()`

Same as `wrap()` but takes in a an async function.

```ts
const result: Result<string, never> = await Result.wrapAsync(() => {
  return Promise.resolve("123");
});
```

### `Result.match()`

Can be used to match against the result.

```ts
const result = ok("hi");

Result.match(
  result,
  (okValue) => {
    console.log("We are ok!", okValue);
  },
  (errValue) => {
    console.log("We are not ok!", errValue);
  },
);
```
