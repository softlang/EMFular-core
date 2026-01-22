import {Referencable} from "../referenceable";
import {Deserializer} from "../../../deserialization/deserializer";
import {Ref} from "../../ref/ref";

export abstract class ReContainer<T extends Referencable> {
    readonly _parent: Referencable;
    readonly referenceName: string;
    readonly inverseName?: string;


    protected constructor(parent: Referencable, referenceName: string, inverseName?: string) {
        this._parent = parent;
        this.referenceName = referenceName;
        this.inverseName = inverseName;
    }

    abstract get(): T[] | T | undefined;

    abstract add(item: T): boolean;

    abstract remove(item: T): boolean;

    abstract removeFromInverse(item: T): boolean;

    //adds the real elements behind refs as received from getOrCreate to the container
    addReferences(context: Deserializer, ...refs: Ref[]): void {
        refs.map((ref: Ref) => {
            let elem: T = context.get(ref.$ref) as T //should just be get now
            this.add(elem)
        })
    }

    prepare(ref: string): void {}

    abstract toJson(): any
    //called to destruct all elements in the container (e.g. when destroying a parent
    abstract delete(): void

}
