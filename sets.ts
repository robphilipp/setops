export interface WithOps<T> extends Set<T> {
    toSet: () => Set<T>
    toArray: () => Array<T>

    map: (callback: (value: T, index: number, s: SetLike<T>) => T) => WithOps<T>,
    filter: (callback: (value: T, index: number, s: SetLike<T>) => boolean) => WithOps<T>,

    /**
     * Calculates the elements of this set that are not in the set `b`. For example, if
     * this set is denoted as `A` and the other set is denoted as `B`, then `A` compliment `B`,
     * or `A\B`, are the elements of `A` that are **not** in `B`.
     * @param b The other set
     * @return The elements of this set that are not in `b`
     */
    compliment: (b: SetLike<T>) => WithOps<T>
    /**
     * Calculates the symmetric difference between this set and the other set. For example, if
     * this set is denoted as `A` and the other set is denoted as `B`, then `A` symmetric difference `B`,
     * or `A ∆ B`, is the union of the set making up the elements of `A` that are **not** in `B` **and**
     * the elements of `B` that are **not** in `A`. Or `A ∆ B = (A\B) ∪ (B\A) = B ∆ A`.
     * @param b The other set
     * @return The union of the elements of this set that are not in `b` and the elements of `b`
     * that are not in this set.
     */
    symmetricDifference: (b: SetLike<T>) => WithOps<T>
    /**
     * Calculates the elements of this set that are also in the other set, `b`. For example, if this
     * set is denoted as `A` and the other set as `B`, then `A` intersection `B`, or `A ∩ B`, are the
     * set of elements that are in both sets.
     * @param b The other set
     * @return the elements of this set that are also in the set `b`
     */
    intersection: (b: SetLike<T>) => WithOps<T>
    /**
     * Calculates a new set consisting of the elements of this set and all the elements in the other set.
     * For example, if this set is denoted as `A` and the other set as `B`, then `A` union `B`, or
     * `A ∪ B`, is the set of all elements in `A` and all the elements in `B`.
     * @param b The other set
     * @return a new set consisting of the elements of this set and all the elements in the other set
     */
    union: (b: SetLike<T>) => WithOps<T>
    /**
     * Calculates the cartesion product of this set with the other set. For example, if this set is denoted
     * by `A` and the other set by `B`, then `A` cartesian product `B`, or `A × B`, is the set of all the
     * possible element pairs
     * @param b
     */
    cartesianProduct: <B>(b: SetLike<B>, comparator: (a: [T, B], b: [T, B]) => boolean) => WithOps<[T, B]>
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

type SetLike<T> = Set<T> | WithOps<T>
type Collection<T> = SetLike<T> | ArrayLike<T>

export function emptySet<T>(): WithOps<T> {
    return setFrom<T>([])
}

export function setFrom<T>(collection: Collection<T>, comparator?: (a: T, b: T) => boolean): WithOps<T> {
    const set = convertToSet(collection)

    function map(callback: (value: T, index: number, s: SetLike<T>) => T): WithOps<T> {
        const fn = (value: T, index: number, array: Array<T>) => callback(value, index, convertToSet(array))
        return setFrom(convertToArray(set).map(fn), comparator)
    }

    function filter(callback: (value: T, index: number, s: SetLike<T>) => boolean): WithOps<T> {
        const fn = (value: T, index: number, array: Array<T>) => callback(value, index, convertToSet(array))
        return setFrom(convertToArray(set).filter(fn), comparator)
    }

    function compliment(b: SetLike<T>): WithOps<T> {
        return setFrom(calculateNotIn(set, b, comparator), comparator)
    }

    function symmetricDifference(b: SetLike<T>): WithOps<T> {
        return setFrom(calculateUnion(calculateNotIn(set, b, comparator), calculateNotIn(b, set, comparator)), comparator)
    }

    function intersection(b: SetLike<T>): WithOps<T> {
        return setFrom(calculateIntersection(set, b, comparator), comparator)
    }

    function union(b: SetLike<T>): WithOps<T> {
        return setFrom(calculateUnion(set, b, comparator), comparator)
    }

    function cartesianProduct<B>(b: SetLike<B>, comparator: (a: [T, B], b: [T, B]) => boolean): WithOps<[T, B]> {
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
        add: (value: T) => setFrom(set.add(value)),
        delete: (value: T) => set.delete(value),
        has: (value: T) => set.has(value),
        size: set.size,

        keys: () => set.keys(),
        values: () => set.values(),
        entries: () => set.entries(),

        forEach: (callback: (value: T, key: T, set: Set<T>) => void, thisArg: any) => set.forEach(callback, thisArg),
        clear: () => set.clear()
    }
}

function convertToSet<T>(collection: Collection<T>): Set<T> {
    if (Array.isArray(collection)) {
        return new Set(collection)
    }
    const set = collection as SetLike<T>
    return ('toSet' in set) ? set.toSet() : set
}

function convertToArray<T>(collection: Collection<T>): Array<T> {
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
                if (comparator(elemA, elemB)) {
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
                if (comparator(elemA, elemB)) {
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
    const product = new Set<[T, B]>()
    for (let elemA of setA) {
        for (let elemB of setB) {
            product.add([elemA, elemB] as [T, B])
        }
    }
    return product
}
