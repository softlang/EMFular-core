import {A, B, InheritanceRoot, ModelInheritance} from "./re-containers-with-inheritance";

describe("ReferencablesWithInheritance", () => {

  it("shows that subclasses inherit the right combined meta", () => {
      const a = new A();
      const b = new B();
      const r = new InheritanceRoot();

      // ❗ These SHOULD be the correct class metas
      expect(a.$classMeta).toBe(ModelInheritance.classes["A"]);
      expect(b.$classMeta).toBe(ModelInheritance.classes["B"]);
      expect(r.$classMeta).toBe(ModelInheritance.classes["InheritanceRoot"]);

// ❗ A and B SHOULD see the inherited parent reference from AbstractBase
      expect("myParent" in a.$classMeta.references).toBeTrue();
      expect("myParent" in b.$classMeta.references).toBeTrue();

// ❗ InheritanceRoot should have children reference
      expect("children" in r.$classMeta.references).toBeTrue();

  })

});
