import {DeletionMode} from "../../utils/deletion-mode";
import {ReferenceMeta} from "../model-definition";

export type Kind = "tree" | "link" | "none";

export interface ModelListWithKind<
    T,
    K extends Kind
> extends ModelList<T> {}

export interface ModelListFromMeta<
    T,
    R extends ReferenceMeta
> extends ModelList<T> {}

export interface ModelList<T>
    extends Array<T> {

    move(from: number, to: number): void;
    swap(from: number, to: number): void;
    remove(...items: T[]): boolean;
    removeCascade(...items: T[]): boolean;
    delete(mode?: DeletionMode): void;

    /** @deprecated Direct index assignment is not supported. Use push()+move  or swap(). */
    [index: number]: T;
    /** @deprecated */
    copyWithin(target: number, start: number, end?: number): this
    /** @deprecated */
    reverse(): T[];
    /** @deprecated */
    unshift(...items: T[]): number;

    /** @deprecated */
    //fill(value: number, start?: number, end?: number): this;
    /** @deprecated */
    // sort
}
