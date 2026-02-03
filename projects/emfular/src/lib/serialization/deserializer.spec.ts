import { Deserializer } from './deserializer';
import {ModelRegistry} from "../binding/model-registry";

describe('Deserializer', () => {
  it('should create an instance', () => {
    let jsonString = "{}"
    let json = JSON.parse(jsonString);
    expect(new Deserializer( new ModelRegistry())).toBeTruthy();
  });
});