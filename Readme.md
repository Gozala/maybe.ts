# Maybe.ts
[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![docs][docs-image]][docs-url]

This library provides means for representing values that may or may not exist.
This can come handy for representing optional arguments, error handling, and
records with optional fields.

## Usage

Library represents values that may or may not exist via `Maybe<a>` type.
Existing value is repsented as `Just<a>` and absense as `Nothing`:

```ts
type Maybe <a> =
  | Nothing
  | Just <a>
```

Given javascript / typescript semantics `Nothing` is just a type alias for union
of primitives representing absence of value:

```ts
type Nothing = null | undefiend | void
```

For the same reason `Just<a>` is just a type alias for `a`:

```ts
type Just<a> = a
``` 

Chosen approach makes optional function argument & optional record fields of
type `a` be fully compatible with `Maybe<a>`. There for all of the functions
exposed are applicable.

This also avoids necessity to box existing values for the sake of typing.


### Import

```ts
import * as Maybe from "maybe.ts"
```

### `toValue(fallback:a, maybe:Maybe<a>):a`

Provide a `fallback` value, turning an optional value into a normal value.

```ts
Maybe.toValue(5, Maybe.just(9)) // => 9
Maybe.toValue(6, Maybe.nothing) // => 6
```

### `map(f:(input:a) => b, maybe:Maybe<a>):Maybe<b>`

Transform a Maybe value with a given function:
 
```ts
Maybe.map(Math.sqrt, Maybe.just(9)) // => Maybe.just(3)
Maybe.map(Math.sqrt, Maybe.nothing) // => Maybe.nothing
```

### `chain(then:(input:a) => Maybe<b>, maybe:Maybe<a>):Maybe<b>`

Utility to chain together two computations that may fail (return Nothing).

```ts
const makeGreeting = (name:string):string =>
  `Hello ${name}!`
 
const greet = (name:Maybe<string>):Maybe<string> =>
  Maybe.chain(makeGreeting, name)
 
greet(Maybe.nothing) // => Maybe.nothing
greet(Maybe.just('world')) // => Maybe.just('Hello world!')
```

### `and(left:Maybe<a>, right:Maybe<b>):Maybe<b>`

Returns `Nothing` if the left Maybe is `Nothing`, otherwise returns the
right Maybe.

```ts
Maybe.and(Maybe.just(2), Maybe.nothing) // => Maybe.nothing
Maybe.and(Maybe.nothing, Maybe.just('foo')) // => Maybe.nothing
Maybe.and(Maybe.just(2), Maybe.just('foo')) // => Maybe.just('foo')
Maybe.and(Maybe.nothing, Maybe.nothing) // => Maybe.nothing
```

### `or(left:Maybe<a>, right:Maybe<a>):Maybe<a>`

Returns the left Maybe if it is a Just value, otherwise returns right Maybe.

```ts
Maybe.or(Maybe.just(2), Maybe.nothing) // => Maybe.just(2)
Maybe.or(Maybe.nothing, Maybe.just('foo')) // => Maybe.just('foo')
Maybe.or(Maybe.just(2), Maybe.just(100)) // => Maybe.just(100)
Maybe.or(Maybe.nothing, Maybe.nothing) // => Maybe.nothing
```

### `isJust(maybe:Maybe<a>):maybe is Just<a>`

Predicate that refines given Maybe. If returns `true` given `Maybe` is
refined to `Just`, otherwise refined to `Nothing`.

```ts
const name:Maybe<string> = Maybe.nothing
if (isJust(name)) {
  console.log(name.toLowerCase())
}
```

### `isNothing = <a> (maybe:Maybe<a>):maybe is Nothing`

Predicate that refines given Maybe. If returns `true` given `Maybe` is
 refined to `Nothing`, otherwise refined to `Just`

```ts
const name:Maybe<string> = Maybe.nothing
if (isNothing(name)) {
    console.error('No name')
} else {
  console.log(name.toLowerCase())
}
```

### `just(value:a) => Maybe<a>`

Turns arbitrary `value` of type `a` into `Maybe<a>`. Not that in most cases you dont need to do this and value `a` can be passed in place for `Maybe<a>`. Still sometimes it's convinent to downcast `Just<a>` (which is alias for `a`) to `Maybe<a>` and this function does just that:

```ts
Maybe.just(4) // => 4
```

### `nothing:Maybe<any>`

This is just an exported `null` and you can use `null`, or `undefined` or `null|undefined|void|a` in place for `Maybe<a>` but sometimes code will read and communiacte intent a lot better when you do use explicit names.


## Install

### yarn

    yarn add --save maybe.ts

### npm

    npm install --save maybe.ts


[travis-image]: https://travis-ci.org/Gozala/maybe.ts.svg?branch=master
[travis-url]: https://travis-ci.org/Gozala/maybe.ts
[npm-image]: https://img.shields.io/npm/v/maybe.ts.svg
[npm-url]: https://npmjs.org/package/maybe.ts
[downloads-image]: https://img.shields.io/npm/dm/maybe.ts.svg
[downloads-url]: https://npmjs.org/package/maybe.ts
[docs-image]:https://img.shields.io/badge/typedoc-latest-ff69b4.svg?style=flat
[docs-url]:https://Gozala.github.io/maybe.ts/index.html