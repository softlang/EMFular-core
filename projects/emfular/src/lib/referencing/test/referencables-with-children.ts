import {ReTreeListContainer} from "../referencable/container/tree/re-tree-list-container";
import {Referencable} from "../referencable/referenceable";
import {ReLinkListContainer} from "../referencable/container/link/re-link-list-container";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";
import {ReTreeParentContainer} from "../referencable/container/tree/re-tree-parent-container";

export enum EClasses {
    'RootWithChildren' = 'namespace/RootWithChildren',
    'Middle2WithChildren' = 'namespace/Middle2WithChildren',
    'ReChild3' = 'namespace/Referencable3WithChildren'
}

@eClass(EClasses.RootWithChildren)
export class RootWithChildren extends Referencable {

    static readonly $child2Name = "child2";
    static readonly $link3Name = "link3";

    readonly _child2: ReTreeListContainer<Middle2WithChildren, RootWithChildren>;
    readonly _link3: ReLinkListContainer<ReChild3, RootWithChildren>;

    @attribute()
    name: string = "referencable1";

    constructor() {
        super();
        this._child2 = new ReTreeListContainer<Middle2WithChildren, RootWithChildren>(this, RootWithChildren.$child2Name);
        this._link3 = new ReLinkListContainer(this, RootWithChildren.$link3Name, ReChild3.$link1Name);
    }

    get child2(): Middle2WithChildren[] {
        return this._child2.get();
    }
    addChild2(...c2s: Middle2WithChildren[]) {
        c2s.map(c2 => this._child2.add(c2))
    }
    removeChild2(...c2s: Middle2WithChildren[]) {
        c2s.map(c2 => this._child2.remove(c2))
    }

    get link3() {
        return this._link3.get()
    }
    addLink3(...c3s: ReChild3[]) {
        c3s.map(c3 => this._link3.add(c3))
    }
    removeLink3(...c3s: ReChild3[]) {
        c3s.map(c3 => this._link3.remove(c3))
    }

}

@eClass(EClasses.Middle2WithChildren)
export class Middle2WithChildren extends Referencable<RootWithChildren> {
    static readonly $child3Name = "child3";
    readonly _child3: ReTreeListContainer<ReChild3, Middle2WithChildren>;

    @attribute()
    name: string = "referencable2";

    constructor() {
        super();
        this._child3 = new ReTreeListContainer<ReChild3, Middle2WithChildren>(this, Middle2WithChildren.$child3Name)
    }

    get child3(): ReChild3[] {
        return this._child3.get()
    }
    addChild3(...c3s: ReChild3[]) {
        c3s.map(c3 => this._child3.add(c3))
    }
    removeChild3(...c3s: ReChild3[]) {
        c3s.map(c3 => this._child3.remove(c3))
    }
}

@eClass(EClasses.ReChild3)
export class ReChild3 extends Referencable<Middle2WithChildren> {
    static readonly $link1Name = "link1";
    readonly _link1: ReLinkListContainer<RootWithChildren, ReChild3>;

    static readonly $parentPointerName = "parentPointer";
    readonly _parentPointer : ReTreeParentContainer<Middle2WithChildren, ReChild3>;

    @attribute()
    name: string = "referencable3";

    constructor() {
        super();
        this._link1 = new ReLinkListContainer(this, ReChild3.$link1Name, RootWithChildren.$link3Name)
        this._parentPointer = new ReTreeParentContainer(this, ReChild3.$parentPointerName, Middle2WithChildren.$child3Name)
    }
    get link1(): RootWithChildren[] {
        return this._link1.get()
    }
    addLink1(...c1s: RootWithChildren[]) {
        c1s.map(c1 => this._link1.add(c1))
    }
    removeLink1(...c1s: RootWithChildren[]) {
        c1s.map(c1 => this._link1.remove(c1))
    }

    get parentPointer(): Middle2WithChildren | undefined {
        return this._parentPointer.get();
    }
    /*
    todo also allow undefined on tree parent setting (on any single container)
     */
    set parentPointer(parentPointer : Middle2WithChildren) {
        this._parentPointer.add(parentPointer)
    }
}



export type RootWithChildrenJson = JsonOf<RootWithChildren>
export type Middle2WithChildrenJson = JsonOf<Middle2WithChildren>
export type ReChild3Json = JsonOf<ReChild3>

