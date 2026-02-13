import { ReSingleContainer } from './re-single-container';
import {ReferencableTester} from "../../test/referencable-tester";
import {Referencable} from "../referenceable";

describe('ReferencableSingletonContainer', () => {
  class ReSingleTester<T extends Referencable<P>, P extends Referencable> extends ReSingleContainer<T, P> {
    constructor(parent: P, referenceName: string, inverseName?: string ) {
      super(parent, referenceName, inverseName);
    }
    toJson(): any {
    }
  }

  it('should create an instance', () => {
    let tester = new ReferencableTester()
    expect(new ReSingleTester(tester, 'refName')).toBeTruthy();
  });

  it('should test the real methods (todo)', () => {})
});
