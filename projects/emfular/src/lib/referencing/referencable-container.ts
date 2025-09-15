import {Referencable} from "./referenceable";

export abstract class ReferencableContainer<T extends Referencable> {
    readonly referenceName: string;
    readonly inverseName?: string;

    protected constructor(referenceName: string, inverseName?: string) {
        this.referenceName = referenceName;
        this.inverseName = inverseName;
    }

    abstract add(item: T): boolean;
}
