import { ReSingleContainer } from './re-single-container';
import {ReferencableTester} from "../../test/referencable-tester";
import {RefHandler} from "../../ref/ref-handler";
import {Referencable} from "../referenceable";

describe('ReferencableSingletonContainer', () => {
  class ReSingleTester<T extends Referencable> extends ReSingleContainer<T> {
    constructor(parent: Referencable, referenceName: string, inverseName?: string ) {
      super(parent, referenceName, inverseName);
    }
    toJson(): any {
    }
  }

  it('should create an instance', () => {
    let tester = new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    expect(new ReSingleTester(tester, 'refName')).toBeTruthy();
  });

  it('should test the real methods (todo)', () => {})
});
