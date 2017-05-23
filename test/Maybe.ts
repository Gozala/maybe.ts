import * as Maybe from ".."
import * as test from "tape"

test("test exports", test => {
  test.isEqual(typeof(Maybe), "object")
  test.ok(isFunction(Maybe.just), "Maybe.just is function")
  test.equal(Maybe.nothing, null, "Maybe.nothing is null")
  test.ok(isFunction(Maybe.toValue), "Maybe.toValue is function")
  test.ok(isFunction(Maybe.map), "Maybe.map is function")
  test.ok(isFunction(Maybe.chain), "Maybe.chain is function")
  test.ok(isFunction(Maybe.and), "Maybe.and is function")
  test.ok(isFunction(Maybe.or), "Maybe.or is function")
  test.ok(isFunction(Maybe.isJust), "Maybe.isJust is function")
  test.ok(isFunction(Maybe.isNothing), "Maybe.isNothing is function")
  test.end()
})

test("test Maybe.just", test => {
  test.isEqual(Maybe.just(5), Maybe.just(5), "Maybe.just(5) -> Maybe.just(5)")
  test.isEqual(Maybe.just(5), 5, "Maybe.just(5) -> 5")
  test.end()
})

test("test Maybe.toValue", test => {
  test.isEqual(Maybe.toValue(5, Maybe.just(7)), Maybe.just(7), "Maybe.toValue(Maybe.just(7), 5)")
  test.isEqual(Maybe.toValue(<number>7, 5), 5, "Maybe.toValue(7, 5) -> Maybe.just(7)")
  test.isEqual(Maybe.toValue(8, Maybe.nothing), 8)
  test.isEqual(Maybe.toValue(-1, Maybe.nothing), -1)
  test.end()
})

test("test Maybe.map", test => {
  test.isEqual(Maybe.map(x => x * 2, Maybe.just(4)), Maybe.just(8))
  test.isEqual(Maybe.map(x => x * 2, 4), Maybe.just(8))
  test.isEqual(Maybe.map(x => x * 2, Maybe.nothing), Maybe.nothing)
  test.end()
})


test("test Maybe.chain", test => {
  class List <a> {
    constructor (public head:a, public tail:Maybe.Maybe<List<a>>) {

    }
  }

  const list = <a> (first:a, ...rest:Array<a>):List<a> =>
    [first, ...rest].reduceRight((tail, head) =>
                                  new List(head, tail), Maybe.nothing)

  const tail = <a> (list:List<a>):Maybe.Maybe<List<a>> =>
    list.tail

  
  
  test.deepEqual(Maybe.chain(tail, Maybe.just(list(1, 2))), list(2))
  test.deepEqual(Maybe.chain(tail, list(1, 2)), list(2))  
  test.deepEqual(Maybe.chain(tail, list(1)), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, Maybe.nothing), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, tail(list(1, 2))), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, Maybe.chain(tail, list(1, 2, 3))), list(3))
  test.deepEqual(Maybe.chain(tail, Maybe.chain(tail, list(1, 2))), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, Maybe.chain(tail, list(1))), Maybe.nothing)
  test.deepEqual(Maybe.chain(tail, Maybe.chain(tail, Maybe.nothing)), Maybe.nothing)

  test.end()
})


test("test Maybe.and", test => {
  test.equal(Maybe.and(Maybe.just(2), Maybe.nothing), Maybe.nothing)
  test.equal(Maybe.and(Maybe.nothing, Maybe.just('foo')), Maybe.nothing)
  test.equal(Maybe.and(Maybe.just(2), Maybe.just('foo')), Maybe.just('foo'))
  test.equal(Maybe.and(Maybe.nothing, Maybe.nothing), Maybe.nothing)

  test.end()
})

test("test Maybe.or", test => {
  test.equal(Maybe.or(Maybe.just(2), Maybe.nothing), Maybe.just(2))
  test.equal(Maybe.or(Maybe.nothing, Maybe.just('foo')), Maybe.just('foo'))
  test.equal(Maybe.or(Maybe.just(2), Maybe.just(10)), Maybe.just(2))
  test.equal(Maybe.or(Maybe.nothing, Maybe.nothing), Maybe.nothing)

  test.end()
})

test("test Maybe.isJust", test => {
  const none:Maybe.Maybe<string> = Maybe.nothing

  if (Maybe.isJust(none)) {
    test.fail(none.toUpperCase())
  } else {
    test.pass('isJust(Maybe.nothing) -> false')
  }

  const thing:Maybe.Maybe<string> = Maybe.just('foo')
  if (Maybe.isJust(thing)) {
    test.equal(thing.toUpperCase(), 'FOO')
  } else {
    test.fail('isJust(Maybe.just("foo")) -> false')
  }

  test.end()
})

test("test Maybe.isNothing", test => {
  const none:Maybe.Maybe<string> = Maybe.nothing

  if (Maybe.isNothing(none)) {
    test.pass('Maybe.isNothing(Maybe.nothing) -> true')
  } else {
    test.fail(none.toUpperCase())
  }

  const thing:Maybe.Maybe<string> = Maybe.just('foo')
  if (Maybe.isNothing(thing)) {
    test.fail('isNothing(Maybe.just("foo")) -> true')
  } else {
    test.equal(thing.toUpperCase(), 'FOO')
  }

  test.end()
})

const isFunction = (value:any):value is Function =>
  typeof value === "function"