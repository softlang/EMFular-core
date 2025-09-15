import {Referencable} from "./referenceable";
import {ReferencableContainer} from "./referencable-container";

export class ReferencableListContainer<T extends Referencable> extends ReferencableContainer<T> {

    readonly _instance: T[] = [];

    constructor(name: string, inverse?: string) {
        super(name, inverse);
    }

    override add(item: T): boolean {
        const index = this._instance.indexOf(item);
        if(index > -1) {
            return false;
        } else {
            this._instance.push(item);
            //todo also add to inverse
            return true;
        }
    }

}
