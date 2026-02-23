import {ReListContainer} from "../re-list-container";
import {Referencable} from "../../referenceable";
import {ModelList} from "./model-list";

export function createListProxy<
    T extends Referencable<any>,
    P extends Referencable<any>
>(container: ReListContainer<T, P>): ModelList<T> {

    const forbidden = (name: string) => {
        throw new Error(`Operation '${name}' is not supported on model lists`);
    };

    function indexOutOfBounds(operation: string, index: number, length: number): never {
        throw new Error(
            `Invalid ${operation}: index ${index} out of bounds (length ${length})`
        );
    }

    function verifyIndexInBounds(operation: string, index: number, length: number): void {
        if (index < 0 || index >= length) {
            indexOutOfBounds(operation, index, length);
        }
    }

    function isIndexAccess(prop: PropertyKey) {
        return typeof prop === "string" && /^\d+$/.test(prop)
    }

    return new Proxy([] as unknown as  ModelList<T>, {

        // ============================================================
        // property reads and method lookups
        // ============================================================
        get(_: ModelList<T>, prop: string|symbol, receiver) {
            const list = container.get();

            if (isIndexAccess(prop)) {
                return list[Number(prop)];
            }

            /*
            The at() method of Array instances takes an integer value and returns the item at that index, allowing for positive and negative integers.
             Negative integers count back from the last item in the array.
             */
            if(prop == "at") {
                return forbidden(prop)
            }

            if (prop === "length") {
                return list.length;
            }

            if (prop === Symbol.iterator) {
                return function* () {
                    yield* list;
                };
            }

            // ============================================================
            // MUTATING METHODS
            // ============================================================

            // push(...items): number =new length
            if (prop === "push") {
                return (...items: T[]) => {
                    for (const item of items) {
                        container.add(item);
                    }
                    return container.get().length;
                };
            }

            // The pop() method removes the last element from an array and returns that value to the caller.
            // If you call pop() on an empty array, it returns undefined.
            if (prop === "pop") {
                return () => {
                    const arr = container.get();
                    if (arr.length === 0) return undefined;
                    const last = arr[arr.length - 1];
                    container.remove(last);
                    return last;
                };
            }

            // The shift() method of Array instances removes the first element from an array and returns that removed element.
            // If you call shift() on an empty array, it returns undefined.
            if (prop === "shift") {
                return () => {
                    const arr = container.get();
                    if (arr.length === 0) return undefined;
                    const first = arr[0];
                    container.remove(first);
                    return first;
                };
            }

            // The unshift(..items) method of Array instances adds the specified elements to the beginning of an array and returns the new length of the array.
            if (prop === "unshift") { //todo
                return (...items: T[]) => {
                    // Insert at front: we need a container.insertAt(0, item)
                    // For now: remove all, re-add in new order
                    const arr = container.get().slice();
                    const newArr = [...items, ...arr];

                    // Clear and rebuild
                    for (const el of arr) container.remove(el);
                    for (const el of newArr) container.add(el);

                    return newArr.length;
                };
            }

            // splice(start, deleteCount, ...items)
            if (prop === "splice") {
                return (start: number, deleteCount: number, ...items: T[]) => {
                    const arr = container.get().slice();
                    const removed = arr.slice(start, start + deleteCount);

                    // remove old
                    for (const r of removed) container.remove(r);

                    // insert new
                    // naive: append then reorder
                    for (const i of items) container.add(i);

                    // reorder to match expected splice result
                    const final = arr.slice();
                    final.splice(start, deleteCount, ...items);

                    const current = container.get();
                    for (let i = 0; i < final.length; i++) {
                        const expected = final[i];
                        const actual = current[i];
                        if (expected !== actual) {
                            const from = current.indexOf(expected);
                            container.move(from, i);
                        }
                    }

                    return removed;
                };
            }

            if (prop === "move") {
                return (from: number, to: number) => {
                    container.move(from, to);
                };
            }

            // sort(compareFn)
            if (prop === "sort") {
                return (compareFn?: (a: T, b: T) => number) => {
                    const arr = container.get().slice();
                    arr.sort(compareFn);

                    // reorder container to match sorted array
                    const current = container.get();
                    for (let i = 0; i < arr.length; i++) {
                        const expected = arr[i];
                        const actual = current[i];
                        if (expected !== actual) {
                            const from = current.indexOf(expected);
                            container.move(from, i);
                        }
                    }

                    return receiver;
                };
            }

            // reverse()
            if (prop === "reverse") {
                return () => {
                    const arr = container.get().slice().reverse();
                    const current = container.get();

                    for (let i = 0; i < arr.length; i++) {
                        const expected = arr[i];
                        const actual = current[i];
                        if (expected !== actual) {
                            const from = current.indexOf(expected);
                            container.move(from, i);
                        }
                    }

                    return receiver;
                };
            }

            // ============================================================
            // FORBIDDEN OPERATIONS
            // ============================================================
            if (prop === "fill") return () => forbidden("fill");
            if (prop === "copyWithin") return () => forbidden("copyWithin");

            // ============================================================
            // NON-MUTATING METHODS — delegate to Array.prototype
            // ============================================================
            const value = (Array.prototype as any)[prop];
            if (typeof value === "function") {
                return value.bind(list);
            }

            return value;
        },

        // ============================================================
        // SET — index assignment and length assignment
        // ============================================================
        set(_: ModelList<T>, prop: string|symbol, value: any) {
            // numeric index assignment
            if (typeof prop === "string" && /^\d+$/.test(prop)) {
                const index = Number(prop);
                const arr = container.get();

                if (index < arr.length) {
                    container.remove(arr[index]);
                }

                container.add(value);
                container.move(arr.length - 1, index);

                return true;
            }

            // forbid length manipulation
            if (prop === "length") {
                forbidden("length assignment");
            }

            return false;
        },

        // ============================================================
        // DELETE — delete arr[i]
        // ============================================================
        deleteProperty(_, prop) {
            if (typeof prop === "string" && /^\d+$/.test(prop)) {
                const index = Number(prop);
                const arr = container.get();
                if (index < arr.length) {
                    arr[index].destruct();
                    return true;
                }
                return false;
            }

            forbidden("delete");
            return false;
        }
    });
}
