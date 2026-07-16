import {Middle2WithChildren, ReChild3, RootWithChildren} from "./referencables-with-children";
import {DeletionMode} from "../../utils/deletion-mode";

describe('ReContainer delete tests', () => {
    it("should relaxed delete re-tree-container correctly", () =>{
        let root = new RootWithChildren();
        let child1 = new ReChild3();
        let child2 = new ReChild3();
        let middle = new Middle2WithChildren();
        root.link3.push(child1,child2);
        middle.child3.push(child1,child2);
        expect(root.link3.length).toBe(2);
        expect(child1.link1).toContain(root);
        expect(child2.link1).toContain(root);
        expect(middle.child3.length).toBe(2);
        expect(child1.parentPointer).toEqual(middle);
        expect(child2.parentPointer).toEqual(middle);
        middle.child3.delete();
        expect(root.link3.length).toBe(2);
        expect(middle.child3.length).toBe(0);
        expect(child1.parentPointer).toBeUndefined();
        expect(child2.parentPointer).toBeUndefined();
    })

    it("should cascade delete re-tree-container correctly", () =>{
        let root = new RootWithChildren();
        let child1 = new ReChild3();
        let child2 = new ReChild3();
        let middle = new Middle2WithChildren();
        root.link3.push(child1,child2);
        middle.child3.push(child1,child2);
        expect(root.link3.length).toBe(2);
        expect(child1.link1).toContain(root);
        expect(child2.link1).toContain(root);
        expect(middle.child3.length).toBe(2);
        expect(child1.parentPointer).toEqual(middle);
        expect(child2.parentPointer).toEqual(middle);
        middle.child3.delete();
        expect(root.link3.length).toBe(2);
        expect(middle.child3.length).toBe(0);
        expect(child1.parentPointer).toBeUndefined();
        expect(child2.parentPointer).toBeUndefined();
    })

    it("should delete re-list-container correctly", () =>{
        let root = new RootWithChildren();
        let child1 = new ReChild3();
        let child2 = new ReChild3();
        let middle = new Middle2WithChildren();
        root.link3.push(child1,child2);
        middle.child3.push(child1,child2);
        expect(root.link3.length).toBe(2);
        expect(child1.link1).toContain(root);
        expect(child2.link1).toContain(root);
        expect(middle.child3.length).toBe(2);
        expect(child1.parentPointer).toEqual(middle);
        expect(child2.parentPointer).toEqual(middle);
        root.link3.delete();
        expect(root.link3.length).toBe(0);
        expect(middle.child3.length).toBe(2);
        expect(child1.parentPointer).toBeDefined();
        expect(child2.parentPointer).toBeDefined();
    })
});