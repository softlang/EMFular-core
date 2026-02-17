import {
    EClasses,
    Referencable1WithChildren, Referencable1WithChildrenJson,
    Referencable2WithChildren, Referencable2WithChildrenJson,
    Referencable3WithChildren, Referencable3WithChildrenJson
} from "./referencables-with-children";
import {SerializationContext} from "../../serialization/serialization-context";
import {RefHandler} from "../ref/ref-handler";

describe('ReContainersWithListChild tests', () => {

    let r1: Referencable1WithChildren;
    let r2_1: Referencable2WithChildren;
    let r2_2: Referencable2WithChildren;
    let r3_1: Referencable3WithChildren;

    beforeEach(() => {
        r1 = new Referencable1WithChildren();
        r2_1 = new Referencable2WithChildren();
        r2_2 = new Referencable2WithChildren();
        r3_1 = new Referencable3WithChildren();
    })

    it('should manage parent pointers correctly', () => {


    });

    it ('should serialize a Referencable1WithChildren correctly', () => {
        r1.addc1_1(r2_1, r2_2)
        r2_1.addc2_1(r3_1)
        r3_1.addc1_2_reversed(r1)
        const ctx = new SerializationContext(r1)
        expect(ctx.get(r3_1).$ref).toEqual("//@c1_1.0/@c2_1.0")
        const r3json: Referencable3WithChildrenJson = {
            name: 'referencable3',
            eClass: EClasses.Referencable3WithChildren,
            c1_2_reversed: [{
                $ref: RefHandler.rootPath,
                eClass: EClasses.Referencable1WithChildren}]
        }
        const r21json: Referencable2WithChildrenJson = {
            name: 'referencable2',
            eClass: EClasses.Referencable2WithChildren,
            c2_1: [r3json]
        }
        const r22json: Referencable2WithChildrenJson = {
            name: 'referencable2',
            eClass: EClasses.Referencable2WithChildren,
        }
        const r1json: Referencable1WithChildrenJson = {
            name: 'referencable1',
            eClass: EClasses.Referencable1WithChildren,
            c1_1: [r21json, r22json],
            c1_2: [{
                $ref: "//@c1_1.0/@c2_1.0",
                eClass: EClasses.Referencable3WithChildren
            }]
        }
        expect(r1.toJson()).toEqual(r1json)
    })

    //todo deserialization test

});