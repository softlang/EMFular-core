import {Referencable} from "../referencing/referencable/referenceable";
import {ReferenceMeta} from "./model-definition";
import {ReContainer} from "../referencing/referencable/container/re-container";
import {ReTreeParentContainer} from "../referencing/referencable/container/tree/re-tree-parent-container";
import {ReTreeListContainer} from "../referencing/referencable/container/tree/re-tree-list-container";
import {ReTreeSingleContainer} from "../referencing/referencable/container/tree/re-tree-single-container";
import {ReLinkListContainer} from "../referencing/referencable/container/link/re-link-list-container";
import {ReLinkSingleContainer} from "../referencing/referencable/container/link/re-link-single-container";


export function createContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
>(
    parent: P,
    meta: ReferenceMeta,
    propertyKey: string
): ReContainer<T, P> {


    if (meta.isParent) {
        return new ReTreeParentContainer<P>(parent, propertyKey, meta.opposite!)
    }

    const isList = meta.max !== 1;

    if (meta.containment) {
        const defaultEClass = parent.$modelUri + meta.target;
        if (isList) {
            return new ReTreeListContainer<T>(parent, propertyKey, undefined, defaultEClass )
        } else {
            return new ReTreeSingleContainer<T>(parent, propertyKey, undefined, defaultEClass )
        }
    }

    if (isList) {
        return new ReLinkListContainer<T, P>(parent, propertyKey, meta.opposite);
    } else {
        return new ReLinkSingleContainer<T, P>(parent, propertyKey, meta.opposite);
    }
}
