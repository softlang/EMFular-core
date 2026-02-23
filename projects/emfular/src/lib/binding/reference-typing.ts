import {ReferenceMeta} from "./model-definition";
import {ModelList, RefKind, SingleRef} from "../referencing/referencable/container/hide/model-list";

export type KindFromMeta<M extends ReferenceMeta> =
    M["isParent"] extends true ? "parent" :
        M["containment"] extends true ? "tree" :
            "link";

export type RefineReference<
    UserType,
    Target,
    Kind extends RefKind,
    IsList extends boolean
> =
    IsList extends true
        ? ModelList<Target, Kind> & UserType
        : SingleRef<Target, Kind> & UserType;
