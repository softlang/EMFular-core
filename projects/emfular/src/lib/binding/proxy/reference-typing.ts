import {ReferenceMeta} from "../model-definition";
import {ModelList} from "./model-list";
import {SingleRef} from "./single-ref";

export type RefKind = "tree" | "link" | "parent";

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
        ? ModelList<Target> & UserType
        : SingleRef<Target, Kind> & UserType;
