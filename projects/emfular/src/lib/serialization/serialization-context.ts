import {Referencable} from "../referencing/referencable/referenceable";
import {Ref} from "../referencing/ref/ref";
import {RefHandler} from "../referencing/ref/ref-handler";
import {SERIALIZE_ASSIGN_REFS} from "../referencing/referencable/referencable-symbols";

export class SerializationContext {

    private refs = new Map<Referencable<any>, Ref>();

    constructor(root: Referencable<any>) {
        root[SERIALIZE_ASSIGN_REFS](this, RefHandler.rootPath)
    }

    put<T extends Referencable<any>>(obj: T, ref: Ref) {
        this.refs.set(obj, ref);
    }

    get<T extends Referencable<any>>(obj: T): Ref {
        const ref = this.refs.get(obj);
        if (!ref) {
            throw new Error("No ref assigned for object " + obj);
        }
        return ref;
    }
}
