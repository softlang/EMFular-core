import { ReTreeSingleContainer } from './re-tree-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {ReContainersWithSingleChild, ReSingleChildExample} from "../../../test/re-containers-with-single-child";
import {DeletionMode} from "../../../../utils/deletion-mode";
import {REFERENCE_INTERNAL_API} from "../../referencable-symbols";

describe('ReferencableTreeSingletonContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReTreeSingleContainer(tester, 'test', refTesterRef.references.test)).toBeTruthy();
  });

  it('should remove child from specified container without it being deleted from any other references', () => {
    let tester = new ReContainersWithSingleChild();
    let middle = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    tester.child.assign(middle);
    middle.otherLink.assign(elem1);
    expect(tester.child).toBeDefined();
    expect(tester.child.value).toEqual(middle);
    expect(middle.myParent.value).toBeDefined();
    expect(middle.myParent.value).toEqual(tester);
    expect(middle.otherLink.value).toBeDefined();
    expect(middle.otherLink.value).toEqual(elem1);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle);
    expect(tester[REFERENCE_INTERNAL_API].treeChildren()[0].remove(middle)).toBeTrue();
    expect(tester.child.value).toBeUndefined();
    expect(middle.myParent.value).toBeUndefined();
    expect(middle.otherLink.value).toBeDefined();
    expect(middle.otherLink.value).toEqual(elem1);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle);
  });

  it('should remove child from specified container and delete its references from all other containers', () => {
    let tester = new ReContainersWithSingleChild();
    let middle = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    tester.child.assign(middle);
    middle.otherLink.assign(elem1);
    expect(tester.child.value).toBeDefined();
    expect(tester.child.value).toEqual(middle);
    expect(middle.myParent.value).toBeDefined();
    expect(middle.myParent.value).toEqual(tester);
    expect(middle.otherLink.value).toBeDefined();
    expect(middle.otherLink.value).toEqual(elem1);
    expect(elem1.link.value).toBeDefined();
    expect(elem1.link.value).toEqual(middle);
    expect(tester[REFERENCE_INTERNAL_API].treeChildren()[0].remove(middle, DeletionMode.CASCADE)).toBeTrue();
    expect(tester.child.value).toBeUndefined();
    expect(middle.myParent.value).toBeUndefined();
    expect(middle.otherLink.value).toBeUndefined();
    expect(elem1.link.value).toBeUndefined();
  });

  it("add() should update a tree single container correctly", () => {
    const parent = new ReContainersWithSingleChild();
    const child1 = new ReSingleChildExample();
    const child2 = new ReSingleChildExample();

    const container = parent[REFERENCE_INTERNAL_API].getContainer("child");

    // assign child1
    container.add(child1);
    expect(container.get()).toBe(child1);
    expect(child1.myParent.value).toBe(parent);

    // replace with child2
    container.add(child2);
    expect(container.get()).toBe(child2);
    expect(child2.myParent.value).toBe(parent);

    // THIS is the critical assertion:
    expect(child1.myParent.value).toBeUndefined();

    // clear by removing child2
    container.remove(child2);
    expect(container.get()).toBeUndefined();
    expect(child2.myParent.value).toBeUndefined();
  });


  it("set() should update a tree single container correctly", () => {
    const parent = new ReContainersWithSingleChild();
    const child1 = new ReSingleChildExample();
    const child2 = new ReSingleChildExample();

    const container = parent[REFERENCE_INTERNAL_API].getContainer("child") as ReTreeSingleContainer<any>;

    // assign
    container.set(child1);
    expect(container.get()).toBe(child1);
    expect(child1.myParent.value).toBe(parent);

    // replace
    container.set(child2);
    expect(container.get()).toBe(child2);
    expect(child2.myParent.value).toBe(parent);
    expect(child1.myParent.value).toBeUndefined();

    // clear
    container.set(undefined);
    expect(container.get()).toBeUndefined();
    expect(child2.myParent.value).toBeUndefined();
  });

});
