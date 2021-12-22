import {emptySet, withOps} from "./sets";

test("should be able to create a set with operations", () => {
    expect(withOps([1, 2, 3, 4]).size).toBe(4)
    expect(withOps(new Set([1, 2, 3, 4, 5, 5, 6])).size).toBe(6)
    expect(emptySet<number>().size).toBe(0)
})

test("should be able to calculate what's not in a set", () => {
    const notIn = withOps([1, 2, 3, 4]).notIn(withOps([2, 3, 4]))
    expect(notIn.toArray()).toEqual([1])
})

test("should be able to map a set", () => {
    const mapped = withOps([1, 2, 3, 4]).map(value => value * 2)
    expect(mapped.toArray()).toEqual([2, 4, 6, 8])
})

test("should be able to calculate the union and intersection of sets", () => {
    const A = withOps([1, 2, 3, 4])
    const B = withOps([3, 4, 5, 6, 7])
    expect(A.union(B).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(A.intersection(B).toArray()).toEqual([3, 4])
})

test("should be able to add and remove elements from a set", () => {
    const set = emptySet<number>()
    expect(set.add(3).toArray()).toEqual([3])
    expect(set.add(1).toArray()).toEqual([3, 1])
    expect(set.add(5).toArray()).toEqual([3, 1, 5])
    expect(set.delete(5)).toBeTruthy()
    expect(set.add(4).add(1).add(5).add(9).toArray()).toEqual([3, 1, 4, 5, 9])
})