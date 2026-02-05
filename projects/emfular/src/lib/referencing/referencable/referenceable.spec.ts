import {Referencable1WithChildren, Referencable2WithChildren, Referencable3WithChildren} from "../test/referencables-with-children";
import {
    Referencable1WithChildrenJson,
    Referencable2WithChildrenJson,
    Referencable3WithChildrenJson
} from "../test/referencables-with-children-json";
import {RefHandler} from "../ref/ref-handler";
import {EClasses} from "../test/eclasses";
import {SerializationContext} from "../../serialization/serialization-context";

describe('Referenceable', () => {

  it ('should serialize a Referencable1WithChildren correctly', () => {
      const r1 : Referencable1WithChildren = new Referencable1WithChildren({$ref: 'r1', eClass: "Referencable1WithChildren"});
      const r2_1: Referencable2WithChildren = new Referencable2WithChildren({$ref: 'r2_1', eClass: "Referencable2WithChildren"});
      const r2_2: Referencable2WithChildren = new Referencable2WithChildren({$ref: 'r2_2', eClass: "Referencable2WithChildren"});
      r1.addc1_1(r2_1, r2_2)
      const r3_1: Referencable3WithChildren = new Referencable3WithChildren({$ref: 'r3_1', eClass: "Referencable3WithChildren"});
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

})
