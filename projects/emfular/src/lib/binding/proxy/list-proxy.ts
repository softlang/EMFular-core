import {Referencable} from "../../referencing/referencable/referenceable";
import {ModelList} from "./model-list";
import {ReListInterface} from "../../referencing/referencable/container/re-list-interface";
import {DeletionMode} from "../../utils/deletion-mode";
import {Kind} from "./reference-typing";

export function createListProxy<
    T extends Referencable<any>,
    P extends Referencable<any>,
    K extends Kind
>(container: ReListInterface<T, P>): ModelList<T, K> {

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

    return new Proxy([] as unknown as ModelList<T, K>, {

        has(_: ModelList<T, K>, prop: PropertyKey) {
            const list = container.get();
            if (isIndexAccess(prop)) {
                const index = Number(prop);
                return index >= 0 && index < list.length;
            }
            return prop in list;
        },

        ownKeys(_: ModelList<T, K>) {
            const list = container.get();
            const keys = [];

            for (let i = 0; i < list.length; i++) {
                keys.push(String(i));
            }

            // include "length" and any other properties you want to expose
            keys.push("length");
            keys.push(Symbol.iterator);

            return keys;
        },


        // ============================================================
        // property reads and method lookups
        // ============================================================
        get(_: ModelList<T, K>, prop: string|symbol, receiver) {
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

            //own convenience method:
            // returns true if it removed at least one item
            if (prop === "remove") {
                return (...items: T[]) =>
                    items.some(item => container.remove(item));
            }

            if (prop === "removeCascade") {
                return (...items: T[]) =>
                    items.some(item => container.remove(item, DeletionMode.CASCADE))
            }

            if(prop === "delete") {
                return (mode?: DeletionMode) => {
                    container.delete(mode);
                }
            }

            // The pop() method removes the last element from an array and returns that value to the caller.
            // If you call pop() on an empty array, it returns undefined.
            if (prop === "pop") {
                return (mode?: DeletionMode) => {
                    const arr = container.get();
                    if (arr.length === 0) return undefined;
                    const last = arr[arr.length - 1];
                    container.remove(last, mode);
                    return last;
                };
            }

            // The shift() method of Array instances removes the first element from an array and returns that removed element.
            // If you call shift() on an empty array, it returns undefined.
            if (prop === "shift") {
                return (mode?: DeletionMode) => {
                    const arr = container.get();
                    if (arr.length === 0) return undefined;
                    const first = arr[0];
                    container.remove(first, mode);
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

            if (prop === "swap") {
                return (from: number, to: number) => {
                    const list = container.get();
                    verifyIndexInBounds("swap", from, list.length);
                    verifyIndexInBounds("swap", to, list.length);
                    if (from === to) return;
                    const b = list[to];
                    container.move(from, to);
                    // indices have changed
                    container.move(list.indexOf(b), from)
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
        set(_target: ModelList<T, K>, prop: string|symbol, _value: any) {
            if (typeof prop === "string" && /^\d+$/.test(prop)) {
                forbidden("index assignment");
            }

            if (prop === "length") {
                forbidden("length assignment");
            }

            return false;
        },

        // ============================================================
        // DELETE — delete arr[i]
        // ============================================================
        deleteProperty(_: ModelList<T, K>, prop) {
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
