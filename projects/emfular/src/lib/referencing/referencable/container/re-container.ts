import {Referencable} from "../referenceable";
import {SerializationContext} from "../../../serialization/serialization-context";
import {ReferenceMeta} from "../../../binding/model-definition";
import {ModelRegistry} from "../../../binding/model-registry";
import {DeletionMode} from "../../../utils/deletion-mode";

export abstract class ReContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> {
    readonly _parent: P;
    readonly meta: ReferenceMeta;
    readonly referenceName: string;
    readonly inverseName?: string;
    readonly isRequired: boolean;

    protected constructor(parent: P, referenceName: string, refMeta: ReferenceMeta) {
        this._parent = parent;
        this.meta = refMeta;
        this.referenceName = referenceName;
        this.isRequired = this.meta.min != undefined && this.meta.min > 0;
        this.inverseName = refMeta.opposite;
    }

    abstract get(): T[] | T | undefined;

    protected abstract addWithoutTypeCheck(item: T): boolean;
    add(item: T): boolean {
        if (this.isAcceptableItem(item)) {
            return this.addWithoutTypeCheck(item);
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

    abstract remove(item: T, mode?: DeletionMode): boolean;

    //called to destruct all elements in the container (e.g. when destroying a parent
    abstract delete(mode?: DeletionMode): void

    abstract toJson(ctx: SerializationContext): any
}
