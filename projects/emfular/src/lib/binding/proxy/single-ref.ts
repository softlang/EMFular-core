import {RefKind} from "./reference-typing";
import {DeletionMode} from "../../utils/deletion-mode";

export type SingleRef<T, Kind extends RefKind> = T | undefined;

export type ContainerAwareSingleRef<T> = MetaAndContainerAwareSingleRef<T, any>;

export interface MetaAndContainerAwareSingleRef<T, Kind extends RefKind> {
    readonly value: T | undefined;
    remove(item: T): boolean;
    removeCascade(item: T): boolean;
    delete(mode?: DeletionMode): void;
}