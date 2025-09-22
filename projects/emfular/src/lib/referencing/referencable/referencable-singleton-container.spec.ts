import { ReferencableSingletonContainer } from './referencable-singleton-container';
import {ReferencableTester} from "./referencable-tester";
import {RefHandler} from "../ref/ref-handler";

describe('ReferencableSingletonContainer', () => {
  it('should create an instance', () => {
    let tester = new ReferencableTester(RefHandler.createRef('1', 'http://www.uni-koblenz.de/Tester'))
    expect(new ReferencableSingletonContainer(tester, 'refName')).toBeTruthy();
  });
});
