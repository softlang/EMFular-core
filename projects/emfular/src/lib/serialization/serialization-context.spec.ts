import { SerializationContext } from './serialization-context';
import {ReferencableTester} from "../referencing/test/referencable-tester";

describe('SerializationContext', () => {
  it('should create an instance', () => {
    expect(new SerializationContext(new ReferencableTester())).toBeTruthy();
  });
});
