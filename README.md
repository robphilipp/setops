# set ops

Set ops provides an enhanced javascript/typescript Set that includes some basic set operations and enhancements to make it easy and fun to use. By construction, this set can be used anywhere a regular JS/TS set is required.

To use the set, simply
```shell
npm install setmath
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
C.add([10, 'ten']).equals(D)
```

## using `setmath`

The `WithOps<T>` returned from the `setmath` factory functions extends the Javascript Set object, adding useful operations and convenience methods. Consequently, it can be passed into any function that requires a type Set as an argument.

### creation

```ts
// an empty set of numbers
import {emptySet} from "./sets";

const empty = emptySet<number>()
```
Creates an empty set of numbers.

```ts
// an empty set of Pigs
type Pig = {
    name: string
    age: number
}
const comparator = (a: Pig, b: Pig) => a.name === b.name && a.age === b.age

const pigs = emptySet<Pig>(comparator)
```
Creates an empty set of `Pig` objects. To ensure that pigs are compared by name and age rather than by the reference of the object, we must provide a comparator function when creating this set. Once the comparator function is provided, we can (mostly) conveniently forget about it.

Suppose we want to create a set that already contains `Pig` objects.
```ts
// using the Pig type and comparator from the previous code
const myPigs = setFrom([{name: 'wilbur', age: 8}, {name: 'stinky', age: 3}], comparator)
```

The `setFrom(...)` function returns an enhanced set. When creating sets from primitive types, you can leave off the comparator.
```ts
const pi = setFrom([3, 1, 4, 1, 5, 9])
```

The `setFrom(...)` accepts array, sets, and other `WithOps` objects from which it creates the set.
```ts
const pi1 = setFrom([3, 1, 4, 1, 5, 9])
const pi2 = setFrom(new Set([3, 1, 4, 1, 5, 9]))
const pi3 = setFrom(pi1)
```

### queries

Once a set is created, we can ask questions about the set.
```ts
// using the Pig type and comparator from the previous code
const myPigs = setFrom([{name: 'wilbur', age: 8}, {name: 'stinky', age: 3}], comparator)
console.log(myPigs.cardinality, myPigs.size)
if (myPigs.nonEmpty()) {
    console.log("I've got pigs!")
}
if (myPigs.isEmpty()) {
    console.log("No pigs...so sad")
}

const yourPigs = setFrom([{name: 'snorter', age: 10}], comparator)

if (myPigs.intersection(yourPigs).nonEmpty()) {
    console.log("You've got my pigs!")
}
if (myPigs.isSubsetOf(yourPigs)) {
    console.log("I've got some of your pigs!")
}
```

### manipulation
A year has passed, and we want to update the age of our pigs.

```ts
const myPigs = setFrom([{name: 'wilbur', age: 8}, {name: 'stinky', age: 3}], comparator)
const myAgedPigs = myPigs.map(pig => ({...pig, age: pig.age+1}))
```

And now, which pigs are younger than 5 years
```ts
const myYoungPigs = myPigs.filter(pig => pig.age < 5)
// only stinky
```

Or what is the average age of the pigs
```ts
const meanAge = myAgedPigs.reduce((sum, age) => sum += age) / myPigs.cardinality
```

We buy a new pig from you
```ts
const snorter = {name: 'snorter', age: 10}
myPigs.add(snorter)
yourPigs.delete(snorter)
```
And so you don't have any more pigs :(...
```ts
if (yourPigs.isEmpty()) {
    console.log("Fresh out of pigs!")
}
```

But, you may want to double check
```ts
console.log("Got snorter?", yourPigs.has(snorter) ? 'yep' : 'nope')
```

### other set functions

```ts
const setA = setFrom([1, 2, 3, 4, 5])
const setB = setFrom([3, 4, 5, 6, 7, 8])

// what's in A that isn't in B?  
// [1, 2]
console.log(setA.compliment(setB).toArray())
// what's in A that isn't in B, and what's in B that isn't in A?  
// [1, 2, 6, 7, 8]
console.log(setA.symmetricDifference(setB).toArray())
```

Suppose we want to enumerate all the car models and colors. Things are a little more tricky. To ensure that each combination only gets added once, and that the new Set has the proper comparator, we need to create comparator for the resultant `(color, model)` tuples created by the cartesian product.
```ts
const colors = setFrom(['red', 'green', 'blue'])
const models = setFrom(['accord', 'prius', 'corsstrek'])

const comparator = ([colorA, modelA], [colorB, modelB]) => colorA === colorB && modelA === modelB
/*
[
  [ 'red', 'accord' ],
  [ 'red', 'prius' ],
  [ 'red', 'corsstrek' ],
  [ 'green', 'accord' ],
  [ 'green', 'prius' ],
  [ 'green', 'corsstrek' ],
  [ 'blue', 'accord' ],
  [ 'blue', 'prius' ],
  [ 'blue', 'corsstrek' ]
]
*/
console.log(colors.cartesianProduct(models, comparator))
```