import {Referencable} from "./referenceable";

export abstract class ReferencableContainer<T extends Referencable> {
    readonly _parent: Referencable;
    readonly referenceName: string;
    readonly inverseName?: string;


    protected constructor(parent: Referencable, referenceName: string, inverseName?: string) {
        this._parent = parent;
        this.referenceName = referenceName;
        this.inverseName = inverseName;
    }

    abstract add(item: T): boolean;
}
