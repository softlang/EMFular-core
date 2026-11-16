import { describe, it, expect } from 'vitest';
import {DemoElement1, DemoElement2} from "./model-without-opposite";

describe('Model Deletion with Uni-directional References', () => {
    it('leaves a dangling reference and throws during serialization when target is destroyed', () => {
        const root = new DemoElement1('root');
        const elem1 = new DemoElement2('elem1');
        const elem2 = new DemoElement2('elem2');

        root.children.push(elem1, elem2);
        elem1.friends.push(elem2);
        elem2.$destruct();
        expect(root.children).not.toContain(elem2);
        expect(elem1.friends).not.toContain(elem2);
    });
});