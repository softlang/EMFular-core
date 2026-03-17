import {Referencable} from "../referenceable";
import {SerializationContext} from "../../../serialization/serialization-context";
import {ReferenceMeta} from "../../../binding/model-definition";

export abstract class ReContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> {
    readonly _parent: P;
    readonly meta: ReferenceMeta;
    readonly referenceName: string;
    readonly inverseName?: string;

    protected constructor(parent: P, referenceName: string, refMeta: ReferenceMeta) {
        this._parent = parent;
        this.meta = refMeta;
        this.referenceName = referenceName;
        this.inverseName = refMeta.opposite;
    }

    abstract get(): T[] | T | undefined;

    abstract add(item: T): boolean;

    abstract remove(item: T): boolean;

    //called to destruct all elements in the container (e.g. when destroying a parent
    abstract delete(): void

    abstract toJson(ctx: SerializationContext): any
}
