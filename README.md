# Maybe

Typescript implementation for Result types very similar to rust.

## Currently implemented:

- `unwrap()`
- `unwrapOr()`
- `expect()`

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
