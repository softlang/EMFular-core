import {
    EClasses,
    Middle2WithChildren,
    Middle2WithChildrenJson,
    ReChild3,
    ReChild3Json,
    RootWithChildren,
    RootWithChildrenJson
} from "./referencables-with-children";
import {SerializationContext} from "../../serialization/serialization-context";
import {RefHandler} from "../ref/ref-handler";
import {Ref} from "../ref/ref";

describe('ReferencablesWithChildren tests', () => {

    let r1: RootWithChildren;
    let r2_1: Middle2WithChildren;
    let r2_2: Middle2WithChildren;
    let r3_1: ReChild3;
    let r3_2: ReChild3;

    beforeEach(() => {
        r1 = new RootWithChildren();
        r2_1 = new Middle2WithChildren();
        r2_2 = new Middle2WithChildren();
        r3_1 = new ReChild3();
        r3_2 = new ReChild3();
    })

    it('should manage parent pointers correctly', () => {
        expect(r2_1.child3.length).toBe(0);
        r2_1.child3.push(r3_1)
        expect(r2_1.child3.length).toBe(1);
        expect(r3_1.parentPointer?.value).toEqual(r2_1)
        r3_2.parentPointer?.assign(r2_1)
        expect(r2_1.child3.length).toBe(2);
        expect(r3_1.parentPointer?.value).toEqual(r2_1)
        expect(r3_2.parentPointer?.value).toEqual(r2_1)

        expect(r2_2.child3.length).toBe(0);
        r2_2.child3.push(r3_1)
        expect(r2_2.child3.length).toBe(1);
        expect(r2_1.child3.length).toBe(1);
        expect(r3_1.parentPointer?.value).toEqual(r2_2)
        expect(r3_2.parentPointer?.value).toEqual(r2_1)
        r3_2.parentPointer?.assign(r2_1)
        expect(r2_2.child3.length).toBe(1);
        expect(r2_1.child3.length).toBe(1);
        expect(r3_1.parentPointer?.value).toEqual(r2_2)
        expect(r3_2.parentPointer?.value).toEqual(r2_1)
        r3_2.parentPointer?.assign(r2_2)
        expect(r2_2.child3.length).toBe(2);
        expect(r2_1.child3.length).toBe(0);
        expect(r3_1.parentPointer?.value).toEqual(r2_2)
        expect(r3_2.parentPointer?.value).toEqual(r2_2)

        //removal:
        r2_2.child3.remove(r3_1)
        expect(r2_2.child3.length).toBe(1);
        expect(r2_1.child3.length).toBe(0);
        expect(r3_1.parentPointer?.value).toEqual(undefined)
        expect(r3_2.parentPointer?.value).toEqual(r2_2)
        // not possible removal:
        r2_2.child3.remove(r3_1)
        expect(r2_2.child3.length).toBe(1);
        expect(r2_1.child3.length).toBe(0);
        expect(r3_1.parentPointer?.value).toEqual(undefined)
        expect(r3_2.parentPointer?.value).toEqual(r2_2)
        //not possible either:
        r2_1.child3.remove(r3_1)
        expect(r2_2.child3.length).toBe(1);
        expect(r2_1.child3.length).toBe(0);
        expect(r3_1.parentPointer?.value).toEqual(undefined)
        expect(r3_2.parentPointer?.value).toEqual(r2_2)

    });

    it ('should serialize a Referencable1WithChildren correctly', () => {
        r1.child2.push(r2_1, r2_2)
        r2_1.child3.push(r3_1)
        r3_1.link1.push(r1)
        const ctx = new SerializationContext(r1)
        expect(ctx.get(r3_1).$ref).toEqual("//@child2.0/@child3.0")
        const r3json: ReChild3Json = {
            name: 'referencable3',
            eClass: EClasses.ReChild3,
            link1: [{
                $ref: RefHandler.rootPath,
                eClass: EClasses.RootWithChildren}]
        }
        const r21json: Middle2WithChildrenJson = {
            name: 'referencable2',
            eClass: EClasses.Middle2WithChildren,
            child3: [r3json]
        }
        const r22json: Middle2WithChildrenJson = {
            name: 'referencable2',
            eClass: EClasses.Middle2WithChildren,
        }
        const r1json: RootWithChildrenJson = {
            name: 'referencable1',
            eClass: EClasses.RootWithChildren,
            child2: [r21json, r22json],
            link3: [{
                $ref: "//@child2.0/@child3.0",
                eClass: EClasses.ReChild3
            }]
        }
        expect(r1.toJson()).toEqual(r1json)
        const json: RootWithChildrenJson = r1.toJson()
        let refs: Ref[] = json.link3 as Ref[]
        expect(refs.length).toBe(1)
    })

    //todo deserialization test

    it("should register the containers correctly on the parent", () => {
        expect(r1.$treeChildren.length).toBe(1)
        expect(r1.$otherReferences.length).toBe(2)

        expect(r2_1.$treeChildren.length).toBe(2)
        expect(r2_1.$otherReferences.length).toBe(0)

        expect(r3_1.$treeChildren.length).toBe(0)
        expect(r1.$otherReferences.length).toBe(2)
    })

    it('should allow swapping elements in a ModelList created via decorators', () => {
        const r = new RootWithChildren();
        const m1 = new Middle2WithChildren();
        const m2 = new Middle2WithChildren();
        const m3 = new Middle2WithChildren();

        r.child2.push(m1, m2, m3);
        expect(r.child2.map(x => x)).toEqual([m1, m2, m3]);

        r.child2.swap(0, 2);
        expect(r.child2.map(x => x)).toEqual([m3, m2, m1]);
    });

    it('should allow flatMap on ModelList proxies (shows proxy behaves like array)', () => {
        // Build a small containment structure
        r1.child2.push(r2_1, r2_2);

        r2_1.child3.push(r3_1);
        r2_2.child3.push(r3_2);

        // This is the critical line that used to fail:
        const allChildren = r1.child2.flatMap(m => m.child3);

        expect(allChildren.length).toBe(2);
        expect(allChildren).toContain(r3_1);
        expect(allChildren).toContain(r3_2);
    });
});