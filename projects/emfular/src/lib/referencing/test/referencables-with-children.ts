import {ReTreeListContainer} from "../referencable/container/tree/re-tree-list-container";
import {Referencable} from "../referencable/referenceable";
import {ReLinkListContainer} from "../referencable/container/link/re-link-list-container";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {JsonOf} from "../../serialization/json-deserializable";

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
        this._child2 = new ReTreeListContainer(this, RootWithChildren.$child2Name);
        this._link3 = new ReLinkListContainer(this, RootWithChildren.$link3Name, ReChild3.$link1Name);
    }

    addChild2(...c2s: Middle2WithChildren[]) {
        c2s.map(c2 => this._child2.add(c2))
    }
    addLink3(...c3s: ReChild3[]) {
        c3s.map(c3 => this._link3.add(c3))
    }

}

@eClass(EClasses.Middle2WithChildren)
export class Middle2WithChildren extends Referencable {
    static readonly $child3Name = "child3";
    readonly _child3: ReTreeListContainer<ReChild3, Middle2WithChildren>;

    @attribute()
    name: string = "referencable2";

    constructor() {
        super();
        this._child3 = new ReTreeListContainer(this, Middle2WithChildren.$child3Name)
    }

    addChild3(...c3s: ReChild3[]) {
        c3s.map(c3 => this._child3.add(c3))
    }
}

@eClass(EClasses.ReChild3)
export class ReChild3 extends Referencable {
    static readonly $link1Name = "link1";
    readonly _link1: ReLinkListContainer<RootWithChildren, ReChild3>;

    @attribute()
    name: string = "referencable3";

    constructor() {
        super();
        this._link1 = new ReLinkListContainer(this, ReChild3.$link1Name, RootWithChildren.$link3Name)
    }
    addLink1(...c1s: RootWithChildren[]) {
        c1s.map(c1 => this._link1.add(c1))
    }
}



export type RootWithChildrenJson = JsonOf<RootWithChildren>
export type Middle2WithChildrenJson = JsonOf<Middle2WithChildren>
export type ReChild3Json = JsonOf<ReChild3>

