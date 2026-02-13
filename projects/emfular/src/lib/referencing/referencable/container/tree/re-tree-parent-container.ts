import {Referencable} from "../../referenceable";
import {Ref} from "../../../ref/ref";
import {SerializationContext} from "../../../../serialization/serialization-context";
import {ReLinkContainer} from "../link/re-link-container";
import {ReContainer} from "../re-container";
import {ReTreeChildrenContainer} from "./re-tree-children-container";

export class ReTreeParentContainer<T extends Referencable> extends ReContainer<T> implements ReLinkContainer<T> {
    override removeFromInverse(item: T): boolean {
        throw new Error("Method not implemented.");
    }
    override delete(): void {
        throw new Error("Method not implemented.");
        //this._parent.destruct() // todo check
    }

    override inverseName: string;

    constructor(parent: Referencable, referenceName: string, inverseName: string ) {
        super(parent, referenceName, inverseName);
        this.inverseName = inverseName;
    }

    get(): T | undefined {
        return (this._parent.getParent() as T)
    }

    add(item: T): boolean {
        let me = this._parent
        /*const currPar = this._parent.$parent
        const currentParentCont: ReTreeChildrenContainer<T> | undefined = currPar? (currPar  as ReTreeChildrenContainer<T>): undefined
        if(currentParentCont != undefined) {
            currentParentCont.remove(this._parent as T)
        }*/
        return item.addToReferencableContainer(this.inverseName, me)
    }

    remove(item: T): boolean {
        return item.removeFromReferencableContainer(this.inverseName, this._parent)
    }

    override toJson(_: SerializationContext):  undefined {
        return undefined
    }

}
