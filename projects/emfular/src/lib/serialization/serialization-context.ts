import {Referencable} from "../referencing/referencable/referenceable";
import {Ref} from "../referencing/ref/ref";
import {RefHandler} from "../referencing/ref/ref-handler";

export class SerializationContext {

    private refs = new Map<Referencable, Ref>();

    constructor(root: Referencable) {
        root.assignRefs(this, RefHandler.rootPath)
    }

    put(obj: Referencable, ref: Ref) {
        this.refs.set(obj, ref);
    }

    get(obj: Referencable): Ref {
        const ref = this.refs.get(obj);
        if (!ref) {
            throw new Error("No ref assigned for object " + obj);
        }
        return ref;
    }
}
