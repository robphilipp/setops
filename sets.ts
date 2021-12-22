export interface WithOps<T> extends Set<T> {
    toSet: () => Set<T>
    toArray: () => Array<T>

    map: (callback: (value: T, index: number, s: SetLike<T>) => T) => WithOps<T>,

    notIn: (b: SetLike<T>) => WithOps<T>
    intersection: (b: SetLike<T>) => WithOps<T>
    union: (b: SetLike<T>) => WithOps<T>
}

type SetLike<T> = Set<T> | WithOps<T>
type Collection<T> = SetLike<T> | ArrayLike<T>

export function emptySet<T>(): WithOps<T> {
    return withOps<T>([])
}

export function withOps<T>(collection: Collection<T>): WithOps<T> {
    const set = convertToSet(collection)

    function map(callback: (value: T, index: number, s: SetLike<T>) => T): WithOps<T> {
        const fn = (value: T, index: number, array: Array<T>) => callback(value, index, convertToSet(array))
        return withOps(convertToArray(set).map(fn))
    }

    function notIn(b: SetLike<T>): WithOps<T> {
        return withOps(convertToArray(set).filter(elemA => !b.has(elemA)))
    }

    function intersection(b: SetLike<T>): WithOps<T> {
        return withOps(convertToArray(set).filter(elemA => b.has(elemA)))
    }

    function union(b: SetLike<T>): WithOps<T> {
        const newSet = new Set(set)
        b.forEach(elemB => newSet.add(elemB))
        return withOps(newSet)
    }

    return {
        toSet: () => set,
        toArray: () => convertToArray(set),

        map,

        notIn,
        intersection,
        union,

        [Symbol.iterator]: () => set.values(),
        [Symbol.toStringTag]: "set",
        add: (value: T) => withOps(set.add(value)),
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
