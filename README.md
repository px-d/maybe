# Maybe

Typescript implementation for Result types very similar to rust.

## Currently implemented:

- `unwrap()`
- `unwrapOr()`
- `expect()`

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

## Namespace Functions

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
  }
);
```
