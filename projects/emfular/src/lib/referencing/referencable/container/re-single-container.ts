import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ReSingleInterface} from "./re-single-interface";
import {ReferenceMeta} from "../../../binding/model-definition";

export abstract class ReSingleContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P>
implements ReSingleInterface<T, P>{

    protected _instance?: T ;

    protected constructor(parent: P, referenceName: string, refMeta: ReferenceMeta) {
        super(parent, referenceName, refMeta);
    }

    override get(): T | undefined {
        return this._instance;
    }

    checkCardinalityConstraints() {
        if (this.meta.min !== undefined && this.meta.min === 1 && this._instance === undefined) {
            return `Minimum cardinality violation: current length 0 is below the required minimum of ${this.meta.min}.`;
        }
        return
    }
}
