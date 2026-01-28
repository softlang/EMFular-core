import { Deserializer } from './deserializer';

describe('Deserializer', () => {
  it('should create an instance', () => {
    let jsonString = "{}"
    let json = JSON.parse(jsonString);
    expect(new Deserializer(json)).toBeTruthy();
  });
});