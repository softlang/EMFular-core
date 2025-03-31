import {Parser} from "./parser";
import {Referencable} from "../referencing/referenceable";

export type ConstructorPointer = ($ref:string) => (p: Parser) => Referencable;
export type ConstructorPointerFor<T extends Referencable> = ($ref:string) => (p: Parser) => T;

export type ConstructorPointers = Map<string, ConstructorPointer>;

