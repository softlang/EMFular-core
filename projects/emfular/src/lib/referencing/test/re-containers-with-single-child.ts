import {Referencable} from "../referencable/referenceable";
import {eClass} from "../../binding/eclass-decorator";
import {attribute} from "../../binding/attribute-decorator";
import {ReTreeSingleContainer} from "../referencable/container/tree/re-tree-single-container";
import {ReLinkSingleContainer} from "../referencable/container/link/re-link-single-container";
import {ReTreeParentContainer} from "../referencable/container/tree/re-tree-parent-container";
import {JsonOf} from "../../serialization/json-deserializable";
import {Deserializer} from "../../serialization/deserializer";

export enum EClassesSingleChild {
    'ReContainersWithSingleChild' = 'class://ReContainersWithSingleChild',
    'ReSingleChildExample' = 'class://ReSingleChildExample'
}

@eClass(EClassesSingleChild.ReContainersWithSingleChild)
export class ReContainersWithSingleChild extends Referencable<any> {

    static readonly $childName = "child"
    readonly _child: ReTreeSingleContainer<ReSingleChildExample>
    get child(): ReSingleChildExample | undefined  {
        return this._child.get()
    }
    set child(child: ReSingleChildExample) {
        this._child.add(child)
    }

    static readonly $linkName = "link";
    readonly _link: ReLinkSingleContainer<ReSingleChildExample, this>
    get link(): ReSingleChildExample | undefined {
        return this._link.get()
    }
    set link(link: ReSingleChildExample) {
        this._link.add(link)
    }

    @attribute()
    name: string = "re1";

    constructor() {
        super();
        this._child = new ReTreeSingleContainer(this, ReContainersWithSingleChild.$childName)
        this._link = new ReLinkSingleContainer(this, ReContainersWithSingleChild.$linkName, ReSingleChildExample.$otherLinkName)
    }

    static fromJSON (convJson: JsonOf<ReContainersWithSingleChild>): ReContainersWithSingleChild {
        return Deserializer.fromJSON<ReContainersWithSingleChild>(
            convJson,
            EClassesSingleChild.ReContainersWithSingleChild
        )
    }

}

@eClass(EClassesSingleChild.ReSingleChildExample)
export class ReSingleChildExample extends Referencable<ReContainersWithSingleChild> {
    static readonly $myParentName = "myParent";
    readonly _myParent : ReTreeParentContainer<this>
    get myParent(): ReContainersWithSingleChild | undefined {
        return this._myParent.get()
    }
    set myParent(p: ReContainersWithSingleChild) {
        this._myParent.add(p)
    }

    static readonly $otherLinkName = "otherLink";
    readonly _otherLink: ReLinkSingleContainer<ReContainersWithSingleChild, this>
    get otherLink(): ReContainersWithSingleChild | undefined {
        return this._otherLink.get()
    }
    set otherLink(p: ReContainersWithSingleChild) {
        this._otherLink.add(p)
    }

    @attribute()
    myBool = true;

    constructor() {
        super();
        this._myParent = new ReTreeParentContainer(this, ReSingleChildExample.$myParentName, ReContainersWithSingleChild.$childName)
        this._otherLink = new ReLinkSingleContainer(this, ReSingleChildExample.$otherLinkName, ReContainersWithSingleChild.$linkName,)
    }
}
