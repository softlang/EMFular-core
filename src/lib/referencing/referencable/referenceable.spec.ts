import { describe, it, expect } from 'vitest';
import {ReferencableTester} from "../test/referencable-tester";
import {Referencable} from "./referenceable";
import {attribute} from "../../binding/attribute-decorator";

describe('Referencable', () => {
    it("should create an instance", () => {
        expect(new ReferencableTester()).toBeTruthy()
    })

    it('get $label falls back to the graphical id', () => {
        const tester = new ReferencableTester();
        expect(tester.$label).toEqual(`${tester.$gId}`);
    });

    class NamedTester extends Referencable<any> {
        @attribute()
        myRef: any = {name: 'test'}
        @attribute()
        fallback?: number;
        @attribute()
        fallback2? : string
        @attribute()
        name?: string;

        constructor(name?: string, fallback?: number, fallback2? : string) {
            super();
            this.name = name;
            this.fallback = fallback;
            this.fallback2 = fallback2;
        }
    }

    it('get $label returns name', () => {
        const tester = new NamedTester('test');
        expect(tester.$label).toEqual('test');
    });

    it('get $label returns gId if no name given', () => {
        const tester = new NamedTester();
        expect(tester.$label).toEqual(tester.$gId);
    });

    it('get $label returns first attribute (42) if no name', () => {
        const tester = new NamedTester(undefined, 42, 'f2');
        expect(tester.$label).toEqual('42')
    })

    it('get $label returns first existing attribute if no name', () => {
        const tester = new NamedTester(undefined, undefined, 'f2');
        expect(tester.$label).toEqual('f2')
    })

    class NamedNoAttributesTester extends Referencable<any> {
        myRef: any = {name: 'test'}
        fallback?: number;
        fallback2? : string
        name?: string;

        constructor(name?: string, fallback?: number, fallback2? : string) {
            super();
            this.name = name;
            this.fallback = fallback;
            this.fallback2 = fallback2;
        }
    }

    it('get $label returns gId if no @attribute', () => {
        const tester = new NamedNoAttributesTester();
        expect(tester.$label).toEqual(tester.$gId);
    });
})
