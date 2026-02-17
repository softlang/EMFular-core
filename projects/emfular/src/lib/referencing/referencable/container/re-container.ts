import {Referencable} from "../referenceable";
import {Deserializer} from "../../../serialization/deserializer";
import {Ref} from "../../ref/ref";
import {SerializationContext} from "../../../serialization/serialization-context";

export abstract class ReContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> {
    readonly _parent: P;
    readonly referenceName: string;
    readonly inverseName?: string;


    protected constructor(parent: P, referenceName: string, inverseName?: string) {
        this._parent = parent;
        this.referenceName = referenceName;
        this.inverseName = inverseName;
    }

    abstract get(): T[] | T | undefined;

    abstract add(item: T): boolean;

    abstract remove(item: T): boolean;

    abstract removeFromInverse(item: T): boolean;

    //adds the real elements behind refs as received from getOrCreate to the container
    addLinks(context: Deserializer, ...refs: Ref[]): void {
        refs?.map((ref: Ref) => {
            let elem: T = context.get(ref.$ref) as T
            this.add(elem)
        })
    }

    abstract toJson(ctx: SerializationContext): any
    //called to destruct all elements in the container (e.g. when destroying a parent
    abstract delete(): void
}
