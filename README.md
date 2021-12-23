# set ops

Set ops provides an enhanced javascript/typescript Set that includes some basic set operations and enhancements to make it easy and fun to use. By construction, this set can be used anywhere a regular JS/TS set is required.

To use the set, simply
```shell
npm install setops
```

In your modules, `import {WithOps, emptySet, setFrom} from 'setops'` and then use the factory function to create the set
```ts
const setA = setFrom([1, 2, 3, 5])
const setB = setFrom([1, 3, 5, 7, 8])
const union = setA.union(setB)
if (setA.intersection(setB).nonEmpty()) {
    console.log("they intersect!")
}

console.log("In A but not in B", setA.compliment(setB))
```

Additional features for sets are:
 - map, filter
 - union, intersection, compliment, symmetric difference, cartesian product
 - is subset, is proper subset
 - empty set
 - equality

When constructing sets of objects or tuples, an optional comparator function can be supplied
that is used for determining element equality. Operations with element equality will be a bit
slower than operations on sets of primitive elements.

```ts
const comparator = (a: [number, string], b: [number, string]) => a[0] === b[0] && a[1] === b[1]
const C = setFrom<[number, string]>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g']], comparator)
const D = setFrom<[number, string]>([[2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g'], [10, 'ten']], comparator)

// true
C.has([1, 'a'])
// false
C.has([1, 'b'])
// true
C.delete([1, 'a'])
// false
C.has([1, 'a'])
// true
C.add([10, 'ten']).equals(D))
```