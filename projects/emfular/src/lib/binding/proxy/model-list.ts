import {RefKind} from "./reference-typing";
import {DeletionMode} from "../../utils/deletion-mode";

export type ForbiddenArrayMethods =
    | "copyWithin"
    | "fill"
    | "sort"
    | "reverse"
    | "unshift";

export type ModelList<T> = MetaAwareModelList<T, any>;

export interface MetaAwareModelList<T, Kind extends RefKind>
    extends Array<T> {

    /** @deprecated Direct index assignment is not supported. Use push()+move  or swap(). */
    [index: number]: T;

    move(from: number, to: number): void;
    swap(from: number, to: number): void;
    remove(...items: T[]): boolean;
    removeCascade(...items: T[]): boolean;
    delete(mode?: DeletionMode): void;
}
