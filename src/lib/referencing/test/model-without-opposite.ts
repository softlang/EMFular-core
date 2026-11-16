import {ModelDefinition, ReferenceMeta} from "../../binding/model-definition";
import {eClass} from "../../binding/eclass-decorator";
import {Referencable} from "../referencable/referenceable";
import {attribute} from "../../binding/attribute-decorator";
import {reference} from "../../binding/reference-decorator";
import {ModelList} from "../referencable/container/hide/model-list";

export const elem1Refs = {
    children1: {
        target: "DemoElement2",
        containment: true,
        min: 0,
        max: -1,
    } satisfies ReferenceMeta,
    children2: {
        target: "DemoElement3",
        containment: true,
        min: 0,
        max: -1,
    } satisfies ReferenceMeta
}

export const elem2Refs = {
    friends: {
        target: "DemoElement2",
        min: 0,
        max: -1,
    } satisfies ReferenceMeta
}

export const elem3Refs = {
    friend: {
        target: "DemoElement3",
        min: 0,
        max: 1
    } satisfies ReferenceMeta
}

export const DemoElementMeta: ModelDefinition = {
    name: "demo",
    prefix: "demo",
    uri: "demo#//",
    classes: {
        DemoElement1: {
            references: elem1Refs
        },
        DemoElement2: {
            references: elem2Refs
        },
        DemoElement3: {
            references: elem3Refs
        }
    }
}

@eClass(DemoElementMeta, "DemoElement1")
export class DemoElement1 extends Referencable<any>{

    constructor(name?: string) {
        super();
        this.name = name;
    }

    @attribute()
    name?: string;

    @reference(elem1Refs.children1)
    declare children1: ModelList<DemoElement2>

    @reference(elem1Refs.children2)
    declare children2: ModelList<DemoElement3>
}

@eClass(DemoElementMeta, "DemoElement2")
export class DemoElement2 extends Referencable<any>{

    @attribute()
    id?: string;

    constructor(id?: string) {
        super();
        this.id = id;
    }

    @reference(elem2Refs.friends)
    declare friends: ModelList<DemoElement2>
}

@eClass(DemoElementMeta, "DemoElement3")
export class DemoElement3 extends Referencable<any>{

    @attribute()
    id?: string;

    constructor(id?: string) {
        super();
        this.id = id;
    }

    @reference(elem3Refs.friend)
    declare friend: DemoElement3 | undefined;
}