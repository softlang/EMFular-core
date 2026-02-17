import {
    EClasses,
    RootWithChildren, RootWithChildrenJson,
    Middle2WithChildren, Middle2WithChildrenJson,
    ReChild3, ReChild3Json
} from "./referencables-with-children";
import {SerializationContext} from "../../serialization/serialization-context";
import {RefHandler} from "../ref/ref-handler";

describe('ReContainersWithListChild tests', () => {

    let r1: RootWithChildren;
    let r2_1: Middle2WithChildren;
    let r2_2: Middle2WithChildren;
    let r3_1: ReChild3;

    beforeEach(() => {
        r1 = new RootWithChildren();
        r2_1 = new Middle2WithChildren();
        r2_2 = new Middle2WithChildren();
        r3_1 = new ReChild3();
    })

    it('should manage parent pointers correctly', () => {


    });

    it ('should serialize a Referencable1WithChildren correctly', () => {
        r1.addChild2(r2_1, r2_2)
        r2_1.addChild3(r3_1)
        r3_1.addLink1(r1)
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
    })

    //todo deserialization test

});