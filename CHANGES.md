# change log

## version 0.0.3 (map T -> U, bug fix)
1. Update the `map` function to allow mapping elements from a type `T` to a type `U`, which was not allow previously. This also means that when type `U` is not a primitive, an optional `comparator` callback function can now be supplied.

    ```ts
    type Lengthy = {string: string, length: number}
    const mapped = setFrom(['one', 'two', 'three', 'four'])
        .map(
            value => ({string: value, length: value.length}),
            (a: Lengthy, b: Lengthy) => a.string === b.string && a.length === b.length)
    expect(mapped.equals(setFrom([
        {string: 'one', length: 3},
        {string: 'two', length: 3},
        {string: 'three', length: 5},
        {string: 'four', length: 4},
    ]))).toBeTruthy()
    ```

2. Fixed bug in the `setFrom(...)` function where the optional `comparator` function wasn't used in creating the (internal) initial set. This led to the possibility that sets had duplicate elements in regard to the supplied `comparator` function. For example,

    ```ts
    type Lengthy = {string: string, length: number}
    expect(setFrom([
        {string: 'one', length: 3},
        {string: 'two', length: 3},
        {string: 'three', length: 5},
        {string: 'four', length: 4},
    ], (a: Lengthy, b: Lengthy) => a.length === b.length).toArray()).toEqual([
        {string: 'one', length: 3},
        {string: 'three', length: 5},
        {string: 'four', length: 4},
    ])
    ```
