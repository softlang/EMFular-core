import {Referencable} from "../referenceable";
import {ReContainer} from "./re-container";
import {ListUpdater} from "../../../utils/list-updater";
import {ModelList} from "./hide/model-list";
import {createListProxy} from "./hide/list-proxy";
import {ReListInterface} from "./re-list-interface";
import {ReferenceMeta} from "../../../binding/model-definition";
import {DeletionMode} from "../../../utils/deletion-mode";


export abstract class ReListContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
> extends ReContainer<T, P>
implements ReListInterface<T, P>{

    readonly _instance: T[] = [];

    private _proxy?: ModelList<T>;

    protected constructor(parent: P, referenceName: string, refMeta: ReferenceMeta, isRequired: boolean) {
        super(parent, referenceName, refMeta, isRequired);
    }

    override get(): T[] {
        return this._instance;
    }

    get proxy(): ModelList<T> {
        if (!this._proxy) {
            this._proxy = createListProxy(this);
        }
        return this._proxy;
    }

    override delete(mode: DeletionMode) {
        ListUpdater.destructAllFromChangingList(this._instance, mode)
    }

    move(from: number, to: number) {
        const le = this._instance.length;
        if(from<0 || to<0 || from>=le || to>=le ) {
            throw new Error("Move called with index out of bounds: length "+le+" and indices from "+from+" and to "+to+".");
        } else {
            const elem: T = this._instance[from]
            this._instance.splice(from, 1);
            this._instance.splice(to,0, elem);
        }
    }

    swap(from: number, to: number) {
        const le = this._instance.length;
        if(from<0 || to<0 || from>=le || to>=le ) {
            throw new Error("Swap called with index out of bounds: length "+le+" and indices from "+from+" and to "+to+".");
        } else {
            const fromElem = this._instance[from];
            this._instance[from] = this._instance[to];
            this._instance[to] = fromElem;
        }
    }

}
