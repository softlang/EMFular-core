import {DeletionMode} from "../../utils/deletion-mode";
import {ReferenceMeta} from "../model-definition";
import {Kind, KindFromMeta} from "./reference-typing";


export type ModelListFromMeta<T, R extends ReferenceMeta> =
    ModelList<T, KindFromMeta<R>>;

export interface ModelList<T, K extends Kind>
    extends Array<T> {

    readonly __kind?: K;   // phantom field

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
