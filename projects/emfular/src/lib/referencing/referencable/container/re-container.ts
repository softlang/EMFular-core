import {Referencable} from "../referenceable";
import {SerializationContext} from "../../../serialization/serialization-context";
import {ReferenceMeta} from "../../../binding/model-definition";
import {ModelRegistry} from "../../../binding/model-registry";

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

    abstract addSafely(item: T): boolean;
    add(item: T): boolean {
        if (this.isAcceptableItem(item)) {
            return this.addSafely(item);
        } else {
            console.log("Forbidden")
            return false;
        }
    }

    isAcceptableItem(item: Referencable<any>): boolean {
        const expectedType = this.meta.target
        const targetEclass = this._parent.$modelUri+expectedType //eclass composition only works since we work inside one model
        let targetConstr = ModelRegistry.get(targetEclass)
        return item instanceof targetConstr;
    }

    isAcceptableEclass(eClass: string): boolean {
        let srcConstr = ModelRegistry.get(eClass)
        return this.isAcceptableItem( new srcConstr()) //todo
    }

    abstract remove(item: T): boolean;

    //called to destruct all elements in the container (e.g. when destroying a parent
    abstract delete(): void

    abstract toJson(ctx: SerializationContext): any
}
