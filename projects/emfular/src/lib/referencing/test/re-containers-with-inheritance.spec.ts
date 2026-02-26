import {A, B, InheritanceRoot, ModelInheritance} from "./re-containers-with-inheritance";

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
      b.myParent = r
      // even inverse chain is correctly triggered, resulting in add to children
      expect(r.children.length).toBe(1);
  })

});
