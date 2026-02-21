import {Referencable} from "../referencing/referencable/referenceable";
import {ModelDefinition, ReferenceMeta} from "./model-definition";
import {ReContainer} from "../referencing/referencable/container/re-container";
import {ReTreeParentContainer} from "../referencing/referencable/container/tree/re-tree-parent-container";
import {ReTreeListContainer} from "../referencing/referencable/container/tree/re-tree-list-container";
import {ReTreeSingleContainer} from "../referencing/referencable/container/tree/re-tree-single-container";
import {ReLinkListContainer} from "../referencing/referencable/container/link/re-link-list-container";
import {ReLinkSingleContainer} from "../referencing/referencable/container/link/re-link-single-container";

export function isParentPointer(
    meta: ReferenceMeta,
    registry: ModelDefinition
): boolean {
    if (!meta.opposite) return false;

    const targetClassMeta = registry.classes[meta.target];
    if (!targetClassMeta) return false;

    const oppositeMeta = targetClassMeta.references[meta.opposite];
    if (!oppositeMeta) return false;

    return oppositeMeta.containment;
}


export function createContainer<
    T extends Referencable<any>,
    P extends Referencable<any>
>(
    parent: P,
    meta: ReferenceMeta,
    model: ModelDefinition,
    propertyKey: string
): ReContainer<T, P> {

    const isList = meta.max !== 1;
    const isContainment = meta.containment;
    const isParent = isParentPointer(meta, model);

    if (isParent) {
        return new ReTreeParentContainer<P>(parent, propertyKey, meta.opposite!)
    }

    if (isContainment) {
        if (isList) {
            return new ReTreeListContainer<T>(parent, propertyKey, meta.opposite)
        } else {
            return new ReTreeSingleContainer<T>(parent, propertyKey, meta.opposite)
        }
    }

    if (isList) {
        return new ReLinkListContainer<T, P>(parent, propertyKey, meta.opposite);
    } else {
        return new ReLinkSingleContainer<T, P>(parent, propertyKey, meta.opposite);
    }
}
