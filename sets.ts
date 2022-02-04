/**
 * @deprecated
 */
export type WithOps<T> = SetWithOps<T>

/**
 * A {@link Set} with enhanced set operations that can be used anywhere a regular javascript
 * set is required. This enhanced set provides additional set operations
 * <ul>
 *     <li>map, mapType, filter</li>
 *     <li>union, intersection, compliment, symmetric difference, cartesian product</li>
 *     <li>is subset, is proper subset</li>
 *     <li>empty set</li>
 *     <li>equality</li>
 * </ul>
 *
 * When construction sets of objects or tuples, an optional comparator function can be supplied
 * that is used for determining element equality. Operations with element equality will be a bit
 * slower than operations on sets of primitive elements.
 *
 * @example
 * const setA = setFrom([1, 2, 3, 5])
 * const setB = setFrom([3, 4, 5, 6, 7])
 *
 * const unionAB = setA.union(setB)
 * if (setA.union(setB).equals([1,2,3,4,5,6,7]) {
 *     console.log("this will be true")
 * }
 */
export interface SetWithOps<T> extends Set<T> {
    toSet: () => Set<T>
    toArray: () => Array<T>

    /**
     * Maps the set into a new set by applying the callback function to each element in the set
     * @param callback The callback function applied to each element
     * @return A new set (with ops) of transformed elements
     * @see mapType
     */
    map: <U>(
        callback: (value: T, index: number, s: SetLike<T>) => T extends U ? T : U,
        comparator?: (a: U, b: U) => boolean
    ) => SetWithOps<T extends U ? T : U>
    /**
     * Calculates a new set containing only the elements the match the predicate function
     * @param callback The callback predicate function
     * @return A new set (with ops) with only the elements that match the predicate
     */
    filter: (callback: (value: T, index: number, s: SetLike<T>) => boolean) => SetWithOps<T>
    /**
     * Calculates a value from the set by applying the reducing function to the elements
     * @param callback The reducing callback
     * @return A value calculated by applying the callback function
     * @example
     *     const A = setFrom([1,2,3,4,5,6,7,8,9,10])
     *     const sum: number = A.reduce((sum, value) => sum += value)
     */
    reduce: (callback: (accum: T, current: T, index: number, s: SetLike<T>) => T) => T

    /**
     * Calculates the elements of this set that are not in the set `b`. For example, if
     * this set is denoted as `A` and the other set is denoted as `B`, then `A` compliment `B`,
     * or `A\B`, are the elements of `A` that are **not** in `B`.
     * @param b The other set
     * @return The elements of this set that are not in `b`
     */
    compliment: (b: SetLike<T>) => SetWithOps<T>
    /**
     * Calculates the symmetric difference between this set and the other set. For example, if
     * this set is denoted as `A` and the other set is denoted as `B`, then `A` symmetric difference `B`,
     * or `A ∆ B`, is the union of the set making up the elements of `A` that are **not** in `B` **and**
     * the elements of `B` that are **not** in `A`. Or `A ∆ B = (A\B) ∪ (B\A) = B ∆ A`.
     * @param b The other set
     * @return The union of the elements of this set that are not in `b` and the elements of `b`
     * that are not in this set.
     */
    symmetricDifference: (b: SetLike<T>) => SetWithOps<T>
    /**
     * Calculates the elements of this set that are also in the other set, `b`. For example, if this
     * set is denoted as `A` and the other set as `B`, then `A` intersection `B`, or `A ∩ B`, are the
     * set of elements that are in both sets.
     * @param b The other set
     * @return the elements of this set that are also in the set `b`
     */
    intersection: (b: SetLike<T>) => SetWithOps<T>
    /**
     * Calculates a new set consisting of the elements of this set and all the elements in the other set.
     * For example, if this set is denoted as `A` and the other set as `B`, then `A` union `B`, or
     * `A ∪ B`, is the set of all elements in `A` and all the elements in `B`.
     * @param b The other set
     * @return a new set consisting of the elements of this set and all the elements in the other set
     */
    union: (b: SetLike<T>) => SetWithOps<T>
    /**
     * Calculates the cartesion product of this set with the other set. For example, if this set is denoted
     * by `A` and the other set by `B`, then `A` cartesian product `B`, or `A × B`, is the set of all the
     * possible element pairs
     * @param b
     */
    cartesianProduct: <B>(b: SetLike<B>, comparator: (a: [T, B], b: [T, B]) => boolean) => SetWithOps<[T, B]>
    /**
     * Calculates if the other set has all the elements found in this set. For example, if this set is
     * denoted as `A` and the other set is denoted as `B`, then `A` is subset of `B`, or `A ⊆ B`, evaluates
     * to `true` if `B` contains, at least, all the elements of `A`.
     * @param b The other set
     * @return `true` if the other set has (at least) all the elements found in this set; `false` otherwise
     */
    isSubsetOf: (b: SetLike<T>) => boolean
    /**
     * Calculates if the other set has all the elements found in this set, and the other set does not equal
     * this set. For example, if this set is denoted as `A` and the other set is denoted as `B`, then
     * `A` is a proper subset of `B`, or `A ⊂ B`, evaluates to `true` if `B` contains all the elements of `A`,
     * **and** `A ≠ B`.
     * @param b The other set
     * @return `true` if the other set has all the elements found in this set, and the other set does not
     * equal this set; `false` otherwise
     */
    isProperSubsetOf: (b: SetLike<T>) => boolean

    /**
     * This set equals the other set if and only if the two sets have exactly the same elements, no more,
     * and no less. For example, if this set is denoted as `A` and the other set is `B`, then the set are
     * equal `iff` `A ∪ B = A ⊂ B`.
     * @param b The other set
     * @return `true` if and only if this set and the other set share exactly the same elements; `false`
     * otherwise.
     * @see notEquals
     */
    equals: (b: SetLike<T>) => boolean
    /**
     * This set does not equal the other set if the two sets do not have exactly the same elements. For
     * example, if this set is denoted as `A` and the other set is `B`, then the set are not equal if
     * `A ∪ B ≠ A ⊂ B`.
     * @param b The other set
     * @return `true` if this set and the other set do not share exactly the same elements; `false`
     * otherwise.
     * @see equals
     */
    notEquals: (b: SetLike<T>) => boolean

    isEmpty: () => boolean
    nonEmpty: () => boolean

    cardinality: number
}

type SetLike<T> = Set<T> | SetWithOps<T>
type Collection<T> = SetLike<T> | ArrayLike<T>

/**
 * Returns an empty set of the specified type, with the optionally specified comparator.
 * @param comparator An optional comparator when building sets of objects. When constructing
 * sets of objects, arrays, or tuples, it is good practice supplying a comparator that defines
 * the equality of elements in the set. Without the comparator, equality is based on the object
 * reference, and the results will be unexpected.
 * @return A {@link Set} with additional operations
 */
export function emptySet<T>(comparator?: (a: T, b: T) => boolean): SetWithOps<T> {
    return setFrom<T>([], comparator)
}

/**
 * Constructs a Set object with additional set operations.
 * @param collection The collection of elements
 * @param comparator An optional comparator when building sets of objects. When constructing
 * sets of objects, arrays, or tuples, it is good practice supplying a comparator that defines
 * the equality of elements in the set. Without the comparator, equality is based on the object
 * reference, and the results will be unexpected.
 * @return A {@link Set} with additional operations
 */
export function setFrom<T>(collection: Collection<T> | ReadonlySet<T>, comparator?: (a: T, b: T) => boolean): SetWithOps<T> {
    const set = convertToSet(collection, comparator)

    function map<U>(
        callback: (value: T, index: number, s: SetLike<T>) => T extends U ? T : U,
        comparator?: (a: U, b: U) => boolean
    ): SetWithOps<T extends U ? T : U> {
        const fn = (value: T, index: number, array: Array<T>) => callback(value, index, convertToSet(array))
        return setFrom(convertToArray(set).map(fn), comparator)
    }

    function filter(callback: (value: T, index: number, s: SetLike<T>) => boolean): SetWithOps<T> {
        const fn = (value: T, index: number, array: Array<T>) => callback(value, index, convertToSet(array))
        return setFrom(convertToArray(set).filter(fn), comparator)
    }

    function reduce(callback: (accum: T, current: T, index: number, s: SetLike<T>) => T): T {
        const fn = (accum: T, current: T, index: number, array: Array<T>) => callback(accum, current, index, convertToSet(array))
        return convertToArray(set).reduce(fn)
    }

    function compliment(b: SetLike<T>): SetWithOps<T> {
        return setFrom(calculateNotIn(set, b, comparator), comparator)
    }

    function symmetricDifference(b: SetLike<T>): SetWithOps<T> {
        return setFrom(calculateUnion(calculateNotIn(set, b, comparator), calculateNotIn(b, set, comparator)), comparator)
    }

    function intersection(b: SetLike<T>): SetWithOps<T> {
        return setFrom(calculateIntersection(set, b, comparator), comparator)
    }

    function union(b: SetLike<T>): SetWithOps<T> {
        return setFrom(calculateUnion(set, b, comparator), comparator)
    }

    function cartesianProduct<B>(b: SetLike<B>, comparator: (a: [T, B], b: [T, B]) => boolean): SetWithOps<[T, B]> {
        return setFrom<[T, B]>(calculateCartesianProduct<T, B>(set, b), comparator)
    }

    function isSubsetOf(b: SetLike<T>): boolean {
        const inter = calculateIntersection(set, b, comparator)
        return inter.size === set.size
    }

    function isProperSubsetOf(b: SetLike<T>): boolean {
        const inter = calculateIntersection(set, b, comparator)
        return inter.size === set.size && inter.size < b.size
    }

    function equals(b: SetLike<T>): boolean {
        const inter = calculateIntersection(set, b, comparator)
        return inter.size === set.size && inter.size === b.size
    }

    return {
        toSet: () => set,
        toArray: () => convertToArray(set),

        map,
        filter,
        reduce,

        isEmpty: () => set.size === 0,
        nonEmpty: () => set.size > 0,

        compliment,
        symmetricDifference,
        intersection,
        union,
        cartesianProduct,
        isSubsetOf,
        isProperSubsetOf,

        equals,
        notEquals: b => !equals(b),

        cardinality: set.size,

        [Symbol.iterator]: () => set.values(),
        [Symbol.toStringTag]: "set",
        add: (value: T) => comparatorAdd(set, value, comparator),
        delete: (value: T) => comparatorDelete(set, value, comparator),
        has: (value: T) => comparatorHas(set, value, comparator),
        size: set.size,

        keys: () => set.keys(),
        values: () => set.values(),
        entries: () => set.entries(),

        forEach: (callback: (value: T, key: T, set: Set<T>) => void, thisArg: any) => set.forEach(callback, thisArg),
        clear: () => set.clear()
    }
}

/**
 * Determines whether the specified set has the specified element. Whether a set has the specified
 * element depends on the comparator. When *no* comparator is specified, then a set *has* the element
 * when the set contains an element that is equal to the specified element using javascript's strict
 * equality measure. When a comparator is specified, then a set *has* the element when the set contains
 * an element that is equal to the specified element using the comparator's equality measure
 * @param set The set to check
 * @param elem The element to check for membership
 * @param comparator The optional comparator used to check for equality
 * @return `true` if the specified element is a member of the specified set; `false` otherwise
 */
function comparatorHas<T>(set: Set<T>, elem: T, comparator?: (a: T, b: T) => boolean): boolean {
    // when no comparator is specified, then shortcut the more expensive operation below, and
    // just use the standard Set.has(...) method.
    if (comparator === undefined) {
        return set.has(elem)
    }

    for (let elemA of set) {
        if (comparator(elem, elemA)) {
            return true
        }
    }
    return false
}

/**
 * Adds an element to the set when the element is *not* already a member of the set.
 * @param set The set to which to add the element
 * @param elem The element to add to the set
 * @param comparator The optional comparator used to check for equality
 * @return A {@link Set} with additional operations
 */
function comparatorAdd<T>(set: Set<T>, elem: T, comparator?: (a: T, b: T) => boolean): SetWithOps<T> {
    if (comparator === undefined) {
        return setFrom(set.add(elem))
    }
    if (comparatorHas(set, elem, comparator)) {
        return setFrom(set, comparator)
    }
    return setFrom(set.add(elem), comparator)
}

/**
 * Deletes an element from the set if the element is a member of the set under the comparator equality.
 * @param set The set from which to remove the element
 * @param elem The element to remove from the set
 * @param comparator The optional comparator used to check for equality
 * @return `true` if the element was removed; `false` otherwise
 */
function comparatorDelete<T>(set: Set<T>, elem: T, comparator?: (a: T, b: T) => boolean): boolean {
    if (comparator === undefined) {
        return set.delete(elem)
    }
    for (let elemA of set) {
        if (comparator(elem, elemA)) {
            set.delete(elemA)
            return true
        }
    }
    return false
}

/**
 * Converts the collection (set, withOps, array-like) to a set. The optional `comparator` should be
 * provided when javascript's equality measure is insufficient for comparing the set's elements. For
 * example, when the set is an element of objects of some type T, and you would like the equality to
 * compare the values in that object.
 * @param collection The collection of elements
 * @param comparator An optional comparator for determining whether elements in a set are equal. The
 * comparator is used to ensure that a set does not have duplicate elements, under the comparator's
 * equality measure.
 * @return A {@link Set}
 */
function convertToSet<T>(collection: Collection<T> | ReadonlySet<T>, comparator?: (a: T, b: T) => boolean): Set<T> {
    if (Array.isArray(collection)) {
        // when there is no comparator defined, the short circuit the slower set construction below
        if (comparator === null) {
            return new Set(collection)
        }

        // deduplicate the elements in the array, using the comparator as an equality measure.
        const set = new Set<T>()
        collection.forEach(elem => {
            if (!comparatorHas(set, elem, comparator)) {
                set.add(elem)
            }
        })
        return set
    }
    const set = collection as SetLike<T>
    return ('toSet' in set) ? set.toSet() : set
}

function convertToArray<T>(collection: Collection<T> | ReadonlySet<T>): Array<T> {
    if (Array.isArray(collection)) {
        return [...collection]
    }
    return [...convertToSet(collection)]
}

function calculateIntersection<T>(setA: Set<T>, setB: SetLike<T>, comparator?: (a: T, b: T) => boolean): Set<T> {
    const intersection = new Set<T>()
    if (comparator !== undefined) {
        for (let elemA of setA) {
            for (let elemB of setB) {
                if (comparator!(elemA, elemB)) {
                    intersection.add(elemA)
                    break
                }
            }
        }
        return intersection
    }
    for (let elemA of setA) {
        if (setB.has(elemA)) {
            intersection.add(elemA)
        }
    }
    return intersection
}

function calculateUnion<T>(setA: Set<T>, setB: SetLike<T>, comparator?: (a: T, b: T) => boolean): Set<T> {
    const union = new Set<T>(setA)
    if (comparator !== undefined) {
        for (let elemB of setB) {
            let found = false
            for (let elemA of setA) {
                if (comparator!(elemA, elemB)) {
                    found= true
                    break
                }
            }
            if (!found) {
                union.add(elemB)
            }
        }
        return union
    }
    setB.forEach(elem => union.add(elem))
    return union
}

function calculateNotIn<T>(setA: Set<T>, setB: SetLike<T>, comparator?: (a: T, b: T) => boolean): Set<T> {
    const notIn = new Set<T>()
    if (comparator !== undefined) {
        for (let elemA of setA) {
            for (let elemB of setB) {
                if (!comparator(elemA, elemB)) {
                    notIn.add(elemA)
                }
            }
        }
        return notIn
    }
    for (let elemA of setA) {
        if (!setB.has(elemA)) {
            notIn.add(elemA)
        }
    }
    return notIn
}

function calculateCartesianProduct<T, B>(setA: Set<T>, setB: SetLike<B>): Set<[T, B]> {
    return setFrom(
        Array.from(setA).flatMap(a => Array.from(setB).map(b => [a, b] as [T, B]))
    )
}

/**
 * Enumerates the combinations of the sets. For example, given the sets `A = {a1}`, `B = {b1, b2}`,
 * and `C = {c1, c2}`. Then this function will generate `[{a1, b1, c1}, {a1, b1, c1}, {a1, b2, c1},
 * {a1, b2, c2}]`.
 * @param sets The sets to combine
 * @return An array holds the combined sets.
 */
export function enumerateCombinations<T>(...sets: Array<SetWithOps<T>>): Array<SetWithOps<T>> {
    const enumerations: Array<Array<T>> = []
    const max = sets.length - 1;
    const matrix = sets.map(set => set.toArray())

    function enumerate(enumeration: Array<T>, n: number): void {
        for (let j = 0, l = matrix[n].length; j < l; j++) {
            const combination: Array<T> = enumeration.slice(0)
            combination.push(matrix[n][j])
            if (n === max) {
                enumerations.push(combination)
            }
            else {
                enumerate(combination, n + 1);
            }
        }
    }

    enumerate([], 0);
    return enumerations.map(combo => setFrom(combo));
}
