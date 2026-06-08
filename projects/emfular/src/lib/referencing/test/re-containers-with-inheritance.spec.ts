import {A, B, InheritanceRoot, ModelInheritance} from "./re-containers-with-inheritance";
import {ReContainer} from "../referencable/container/re-container";
import {REFERENCE_INTERNAL_API} from "../referencable/referencable-symbols";

describe("ReferencablesWithInheritance", () => {

  it("shows that subclasses can access the base class meta", () => {
      const a = new A();
      const b = new B();
      const r = new InheritanceRoot();

      expect(a.$classMeta).toBe(ModelInheritance.classes["A"]);
      expect(b.$classMeta).toBe(ModelInheritance.classes["B"]);
      expect(r.$classMeta).toBe(ModelInheritance.classes["InheritanceRoot"]);

// ❗ InheritanceRoot should have children reference
      expect("children" in r.$classMeta.references).toBeTrue();
      // ❗ A and B do not have the reference from its base
      expect("myParent" in a.$classMeta.references).toBeFalse();
      expect("myParent" in b.$classMeta.references).toBeFalse();

      expect(r.children.length).toBe(0);
      //still access works:
      b.myParent.assign(r)
      // even inverse chain is correctly triggered, resulting in add to children
      expect(r.children.length).toBe(1);
  })

    it("should forbid adding a wrong element to a container", ()=> {
        const root = new InheritanceRoot();
        const root2 = new InheritanceRoot();
        const a = new A();
        const ref = root[REFERENCE_INTERNAL_API].treeChildren()[0] as ReContainer<any, any>;
        expect(root.children.length).toBe(0);
        const res = ref.add(root2)
        expect(res).toBeFalse()
        expect(root.children.length).toBe(0);
        const res2 = ref.add(a)
        expect(res2).toBeTrue()
        expect(root.children.length).toBe(1);
    })

});
