import {Referencable} from "../referenceable";
import {SerializationContext} from "../../../serialization/serialization-context";

export abstract class ReContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> {
    readonly _parent: P;
    readonly referenceName: string;

    constructor(parent: P, referenceName: string, isRequired: boolean = false) {
        this._parent = parent;
        this.referenceName = referenceName;
    }

    abstract get(): T[] | T | undefined;

    abstract add(item: T): boolean;

    abstract remove(item: T): boolean;

    //called to destruct all elements in the container (e.g. when destroying a parent
    abstract delete(): void

    abstract toJson(ctx: SerializationContext): any
}
