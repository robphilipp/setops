import {emptySet, setFrom} from "./sets";

test("should be able to create a set with operations", () => {
    expect(setFrom([1, 2, 3, 4]).size).toBe(4)
    expect(setFrom(new Set([1, 2, 3, 4, 5, 5, 6])).size).toBe(6)
    expect(emptySet<number>().size).toBe(0)
})

test("creating a set of objects without comparator will have duplicates in the expected sense", () => {
    expect(setFrom([
        {string: 'one', length: 3},
        {string: 'one', length: 3},
        {string: 'two', length: 3},
        {string: 'three', length: 5},
        {string: 'four', length: 4},
    ]).toArray()).toEqual([
        {string: 'one', length: 3},
        // and a duplication in the "expected" sense (need to use comparator)
        {string: 'one', length: 3},
        {string: 'two', length: 3},
        {string: 'three', length: 5},
        {string: 'four', length: 4},
    ])
})

test("should be able to create a set with operations using a comparator for equality", () => {
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
})

test("should be able to calculate what's not in a set", () => {
    const A = setFrom([1, 2, 3, 4])
    const B = setFrom([2, 3, 4])
    const C = setFrom([2, 3, 4, 5])

    // A\B (elements of A that are not in B)
    expect(A.compliment(B).equals(setFrom([1]))).toBeTruthy()

    // if B is a subset of A, then B\A (elements of B that are not in A) is an empty set
    expect(B.isSubsetOf(A) && B.compliment(A).equals(emptySet())).toBeTruthy()

    // when B is a proper subset of A, then B\A (elements of B that are not in A) is an empty set
    expect(B.compliment(A).equals(emptySet())).toBeTruthy()

    // when C is not a subset of A, then C\A (elements of C that are not in A) is not an empty set
    expect(C.compliment(A).equals(setFrom([5]))).toBeTruthy()

    expect(A.compliment(C).notEquals(C.compliment(A))).toBeTruthy()

    // (empty set)\A = empty set
    expect(emptySet().compliment(A).equals(emptySet())).toBeTruthy()

    // A ∆ B = A\C union C\A = B ∆ A
    expect(A.compliment(C).union(C.compliment(A)).equals(A.symmetricDifference(C))).toBeTruthy()
    expect(A.compliment(C).union(C.compliment(A)).equals(C.symmetricDifference(A))).toBeTruthy()
})

test("should be able to map a set of same type", () => {
    const mapped = setFrom([1, 2, 3, 4]).map(value => value * 2)
    expect(mapped.toArray()).toEqual([2, 4, 6, 8])
})

test("should be able to map a set of different type", () => {
    const mapped = setFrom(['one', 'two', 'three', 'four']).map(value => value.length)
    expect(mapped.equals(setFrom([3, 4, 5]))).toBeTruthy()
})

test("should be able to map a set of different type with comparator", () => {
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
    const mapped2 = setFrom(['one', 'two', 'three', 'four'])
        .map(
            value => ({string: value, length: value.length}),
            // the comparator only cares about length
            (a: Lengthy, b: Lengthy) => a.length === b.length)

    // because the comparator only cares about length, {string: 'one', length: 3} equals {string: 'two', length: 3}
    expect(mapped2.equals(setFrom([
        // {string: 'one', length: 3},
        {string: 'two', length: 3},
        {string: 'three', length: 5},
        {string: 'four', length: 4},
    ]))).toBeTruthy()
})

test("should be able to filter a set", () => {
    const mapped = setFrom([1, 2, 3, 4]).filter(value => value % 2 === 0)
    expect(mapped.toArray()).toEqual([2, 4])
})

test("should be able to reduce a set", () => {
    const A = setFrom([1,2,3,4,5,6,7,8,9,10])
    expect(A.reduce((sum, value) => sum + value)).toBe(55)
})

test("should be able to calculate the union of sets", () => {
    const A = setFrom([1, 2, 3, 4])
    const B = setFrom([3, 4, 5, 6, 7])
    const C = setFrom([1, 2, 3, 4, 5, 6, 7])
    expect(A.union(B).equals(C)).toBeTruthy()

    expect(A.union(B).equals(B.union(A))).toBeTruthy()
    expect(A.isSubsetOf(A.union(B))).toBeTruthy()
    expect(A.isProperSubsetOf(A.union(B))).toBeTruthy()
    expect(A.union(A).equals(A)).toBeTruthy()
    expect(A.union(emptySet()).equals(A)).toBeTruthy()

    expect(A.isSubsetOf(B) && A.union(B).notEquals(B)).toBeFalsy()
    expect(A.isSubsetOf(C) && A.union(C).equals(C)).toBeTruthy()
})

test("should be able to calculate the union of sets with comparator", () => {
    const comparator = (a: [number, string], b: [number, string]) => a[0] === b[0] && a[1] === b[1]
    const A = setFrom<[number, string]>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']], comparator)
    const B = setFrom<[number, string]>([[3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g']], comparator)
    const C = setFrom<[number, string]>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g']], comparator)
    expect(A.union(B).equals(C)).toBeTruthy()

    expect(A.union(B).equals(B.union(A))).toBeTruthy()
    expect(A.isSubsetOf(A.union(B))).toBeTruthy()
    expect(A.isProperSubsetOf(A.union(B))).toBeTruthy()
    expect(A.union(A).equals(A)).toBeTruthy()
    expect(A.union(emptySet()).equals(A)).toBeTruthy()

    expect(A.isSubsetOf(B) && A.union(B).notEquals(B)).toBeFalsy()
    expect(A.isSubsetOf(C) && A.union(C).equals(C)).toBeTruthy()
})

test("should be able to calculate the intersection of sets", () => {
    const A = setFrom([1, 2, 3, 4])
    const B = setFrom([3, 4, 5, 6, 7])
    const C = setFrom([1, 2, 3, 4, 5, 6, 7])

    expect(A.intersection(B).equals(setFrom([3, 4]))).toBeTruthy()

    // A intersection B must equal B intersection A
    expect(A.intersection(B).equals(B.intersection(A))).toBeTruthy()

    // A intersection B is a proper subset of A when A != B
    expect(A.intersection(B).isProperSubsetOf(A)).toBeTruthy()
    expect(A.intersection(A).isProperSubsetOf(A)).toBeFalsy()

    // A intersection A must equal A
    expect(A.intersection(A).equals(A)).toBeTruthy()

    // A intersection with an empty set is an empty set
    expect(A.intersection(emptySet()).equals(emptySet())).toBeTruthy()

    // A is a subset of B iff A intersection B = A
    expect(!A.isSubsetOf(B) && A.intersection(B).notEquals(A)).toBeTruthy()
    expect(A.isSubsetOf(C) && A.intersection(C).equals(A)).toBeTruthy()

})

test("should be able to calculate the cartesian product of two sets", () => {
    const comparator = (a: [number, string], b: [number, string]) => a[0] === b[0] && a[1] === b[1]
    const A = setFrom([1, 2, 3, 4])
    const B = setFrom(['one', 'two', 'three', 'four'])
    expect(A.cartesianProduct(B, comparator).equals(setFrom([
        [1, 'one'], [1, 'two'], [1, 'three'], [1, 'four'],
        [2, 'one'], [2, 'two'], [2, 'three'], [2, 'four'],
        [3, 'one'], [3, 'two'], [3, 'three'], [3, 'four'],
        [4, 'one'], [4, 'two'], [4, 'three'], [4, 'four'],
    ], comparator))).toBeTruthy()
})

test("should be able to add and remove elements from a set", () => {
    const set = emptySet<number>()
    expect(set.isEmpty()).toBeTruthy()
    expect(set.nonEmpty()).toBeFalsy()
    expect(set.add(3).toArray()).toEqual([3])
    expect(set.add(1).toArray()).toEqual([3, 1])
    expect(set.add(5).toArray()).toEqual([3, 1, 5])
    expect(set.delete(5)).toBeTruthy()
    expect(set.add(4).add(1).add(5).add(9).toArray()).toEqual([3, 1, 4, 5, 9])
    expect(set.isEmpty()).toBeFalsy()
    expect(set.nonEmpty()).toBeTruthy()
})

test("should be able to test subset and equality", () => {
    const setA = setFrom([1,2,3,4,5,6])
    const setB = setFrom([3,4,6,7,8,10])
    const setC = setA.intersection(setB)

    // a set should equal itself
    expect(setA.equals(setA)).toBeTruthy()
    expect(setA.notEquals(setA)).toBeFalsy()

    // two unequal sets should not be equal
    expect(setA.equals(setB)).toBeFalsy()
    expect(setA.notEquals(setB)).toBeTruthy()

    // the intersection of to unequal sets, A and B, is a proper subset of both sets A and B
    expect(setC.isSubsetOf(setA)).toBeTruthy()
    expect(setC.isSubsetOf(setB)).toBeTruthy()
    expect(setC.isProperSubsetOf(setA)).toBeTruthy()
    expect(setC.isProperSubsetOf(setB)).toBeTruthy()

    // as set is a subset of itself, but not a proper subset of itself
    expect(setA.isSubsetOf(setA)).toBeTruthy()
    expect(setA.isProperSubsetOf(setA)).toBeFalsy()

    // an empty set is a subset of every set
    expect(emptySet<number>().isProperSubsetOf(setA)).toBeTruthy()
    expect(emptySet<number>().isProperSubsetOf(setB)).toBeTruthy()

    // an empty set is a subset of an empty set, but not a proper subset of an empty set
    expect(emptySet().isProperSubsetOf(emptySet())).toBeFalsy()
    expect(emptySet().isSubsetOf(emptySet())).toBeTruthy()
})

function testSetSize(a: Set<number>): number {
    return a.size
}

test("should be able to call a function that accepts a Set", () => {
    expect(testSetSize(setFrom([1,2,3,4]))).toBe(4)
})

test("should be able to check membership of objects", () => {
    const comparator = (a: [number, string], b: [number, string]) => a[0] === b[0] && a[1] === b[1]
    const C = setFrom<[number, string]>([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g']], comparator)
    const D = setFrom<[number, string]>([[2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g'], [10, 'ten']], comparator)

    expect(C.has([1, 'a'])).toBeTruthy()
    expect(C.has([1, 'b'])).toBeFalsy()
    expect(C.delete([1, 'a'])).toBeTruthy()
    expect(C.has([1, 'a'])).toBeFalsy()

    expect(C.add([10, 'ten']).equals(D)).toBeTruthy()
})
