import {Referencable} from "../referenceable";
import {SerializationContext} from "../../../serialization/serialization-context";
import { DeletionMode } from "../../../utils/deletion-mode";

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

    abstract remove(item: T, mode: DeletionMode): boolean;

    //called to destruct all elements in the container (e.g. when destroying a parent
    abstract delete(mode: DeletionMode): void

    abstract toJson(ctx: SerializationContext): any
}
