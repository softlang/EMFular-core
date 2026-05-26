import {DeletionMode} from "../../utils/deletion-mode";
import {ReferenceMeta} from "../model-definition";
import {Kind} from "./model-list";

export type SingleRef<T, K extends Kind> = T | undefined;

export interface SingleRef2WithKind<
    T,
    K extends Kind
> extends SingleRef2<T>{}

export interface SingleRef2FromMeta<
    T,
    R extends ReferenceMeta
> extends SingleRef2<T> {}

export interface SingleRef2<T> {
    readonly value: T | undefined;
    remove(item: T): boolean;
    removeCascade(item: T): boolean;
    delete(mode?: DeletionMode): void;
}