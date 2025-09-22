import { ReferencableTester } from './referencable-tester';
import {RefHandler} from "../ref/ref-handler";

describe('ReferencableTester', () => {
  it('should create an instance', () => {
    expect(
        new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    ).toBeTruthy();
  });
});
