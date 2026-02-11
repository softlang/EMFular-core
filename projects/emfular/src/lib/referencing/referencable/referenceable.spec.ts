import {Referencable1WithChildren, Referencable2WithChildren, Referencable3WithChildren} from "../test/referencables-with-children";
import {
    Referencable1WithChildrenJson,
    Referencable2WithChildrenJson,
    Referencable3WithChildrenJson,
    EClasses
} from "../test/referencables-with-children";
import {RefHandler} from "../ref/ref-handler";
import {SerializationContext} from "../../serialization/serialization-context";
import {
    EClassesSingleChild,
    ReContainersWithSingleChild,
    ReSingleChildExample
} from "../test/re-containers-with-single-child";

describe('Referenceable', () => {

  it ('should serialize a Referencable1WithChildren correctly', () => {
      const r1 : Referencable1WithChildren = new Referencable1WithChildren();
      const r2_1: Referencable2WithChildren = new Referencable2WithChildren();
      const r2_2: Referencable2WithChildren = new Referencable2WithChildren();
      r1.addc1_1(r2_1, r2_2)
      const r3_1: Referencable3WithChildren = new Referencable3WithChildren();
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


    it('should serialize and deserialize a ReContainersWithSingleChild (todo both directions for tree parent)', () => {
        const root: ReContainersWithSingleChild = new ReContainersWithSingleChild();
        const child: ReSingleChildExample = new ReSingleChildExample();

        const rootJson = root.toJson()

        expect(rootJson).toEqual({name: "re1", eClass: EClassesSingleChild.ReContainersWithSingleChild})
        const rootFromJson: ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(rootJson)
        expect(rootFromJson.name).toEqual(root.name)
        expect(rootFromJson.child).toBeUndefined()
        expect(rootFromJson.link).toBeUndefined()

        // now create parent/child:
        child.myParent = root; //todo both directions now necessary
        root.child = child;
        expect(child.myParent?.name).toEqual(root.name)
        expect(child.myParent?.link).toBeUndefined()

        const jsonNoLinks = root.toJson()
        expect(jsonNoLinks.child).toBeDefined()
        expect(jsonNoLinks.link).toBeUndefined()

        const fromNoLinks : ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(jsonNoLinks)
        expect(fromNoLinks.link).toBeUndefined()
        expect(fromNoLinks.child?.myParent?.name).toEqual(root.name)

        //add other links:
        root.link = child;
        expect(child.otherLink).toEqual(root)
        const completeJson = root.toJson()
        expect(completeJson.name).toEqual(root.name)
        expect(completeJson.link).toBeDefined()

        const completeFromJson : ReContainersWithSingleChild = ReContainersWithSingleChild.fromJSON(completeJson)
        expect(completeFromJson.name).toEqual(root.name)
        expect(completeFromJson.link).toEqual(completeFromJson.child)
    })
})
