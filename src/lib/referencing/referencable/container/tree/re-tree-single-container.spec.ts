import { describe, expect, it } from 'vitest';
import { ReTreeSingleContainer } from './re-tree-single-container';
import {ReferencableTester, refTesterRef} from "../../../test/referencable-tester";
import {
  ReContainersWithSingleChild, ReContainersWithSingleChild2,
  ReSingleChildExample,
  ReSingleChildExample2,
  ReSingleCircleChild
} from "../../../test/re-containers-with-single-child";
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
    tester.child = middle;
    middle.otherLink = elem1;
    expect(tester.child).toBeDefined();
    expect(tester.child).toEqual(middle);
    expect(middle.myParent).toBeDefined();
    expect(middle.myParent).toEqual(tester);
    expect(middle.otherLink).toBeDefined();
    expect(middle.otherLink).toEqual(elem1);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle);
    expect(tester[REFERENCE_INTERNAL_API].treeChildren()[0].remove(middle)).toBeTruthy();
    expect(tester.child).toBeUndefined();
    expect(middle.myParent).toBeUndefined();
    expect(middle.otherLink).toBeDefined();
    expect(middle.otherLink).toEqual(elem1);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle);
  });

  it('should remove child from specified container and delete its references from all other containers', () => {
    let tester = new ReContainersWithSingleChild();
    let middle = new ReSingleChildExample();
    let elem1 = new ReContainersWithSingleChild();
    tester.child = middle;
    middle.otherLink = elem1;
    expect(tester.child).toBeDefined();
    expect(tester.child).toEqual(middle);
    expect(middle.myParent).toBeDefined();
    expect(middle.myParent).toEqual(tester);
    expect(middle.otherLink).toBeDefined();
    expect(middle.otherLink).toEqual(elem1);
    expect(elem1.link).toBeDefined();
    expect(elem1.link).toEqual(middle);
    expect(tester[REFERENCE_INTERNAL_API].treeChildren()[0].remove(middle, DeletionMode.CASCADE)).toBeTruthy();
    expect(tester.child).toBeUndefined();
    expect(middle.myParent).toBeUndefined();
    expect(middle.otherLink).toBeUndefined();
    expect(elem1.link).toBeUndefined();
  });

  it("should collect violations recursively, keyed by graphical id", () => {
    let root = new ReContainersWithSingleChild2();
    let child = new ReSingleChildExample2();
    root.child = child;
    const modelViolations = root.collectConstraintViolations();
    expect(modelViolations.size).toBe(1);
    expect(modelViolations.has(root.$gId)).toBeFalsy();
    expect(modelViolations.has(child.$gId)).toBeTruthy();
    expect(modelViolations.get(child.$gId)).toBe(child[REFERENCE_INTERNAL_API].violations());
    expect(modelViolations.get(child.$gId)!.has("otherLink")).toBeTruthy();
    child.otherLink = new ReContainersWithSingleChild2();
    expect(root.collectConstraintViolations().size).toBe(0);
  })

  it("should detect circular containment", () => {
    let root = new ReContainersWithSingleChild();
    let child = new ReSingleCircleChild();
    root.circleChild = child;
    child.closeCircle = root;
    const modelViolations = root.collectConstraintViolations();
    expect(modelViolations.size).toBe(1);
    expect(modelViolations.has(root.$gId)).toBeFalsy();
    expect(modelViolations.has(child.$gId)).toBeTruthy();
    expect(modelViolations.get(child.$gId)).toBe(child[REFERENCE_INTERNAL_API].violations());
    expect(modelViolations.get(child.$gId)!.has("closeCircle")).toBeTruthy();
    child.closeCircle = undefined;
    expect(root.collectConstraintViolations().size).toBe(0);
  })
});
