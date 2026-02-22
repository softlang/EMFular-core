import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ListUpdater} from "../../../utils/list-updater";

export abstract class ReListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P>{

    readonly _instance: T[] = [];

    protected constructor(parent: P, referenceName: string, inverseName?: string ) {
        super(parent, referenceName, inverseName);
    }

    override get(): T[] {
        return this._instance;
    }

    override delete() {
        ListUpdater.destructAllFromChangingList(this._instance)
    }

}
