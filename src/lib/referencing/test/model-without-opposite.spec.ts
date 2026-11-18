import { describe, it, expect } from 'vitest';
import {DemoElement1, DemoElement2, DemoElement3} from "./model-without-opposite";

describe('Model Deletion with Uni-directional References', () => {
    it('should not leave dangling reference in a list link', () => {
        const root = new DemoElement1('root');
        const elem1 = new DemoElement2('elem1');
        const elem2 = new DemoElement2('elem2');

        elem1.friends.push(elem2);
        elem2.$destruct();
        expect(root.children1).not.toContain(elem2);
        expect(elem1.friends).not.toContain(elem2);
    });
    it('should not leave dangling reference in a single link', () => {
        const root = new DemoElement1('root');
        const elem1 = new DemoElement3('elem1');
        const elem2 = new DemoElement3('elem2');

        root.children2.push(elem1, elem2);
        elem1.friend = elem2;
        elem2.$destruct();
        expect(root.children2).not.toContain(elem2);
        expect(elem1.friend).toBeUndefined();
    });
});