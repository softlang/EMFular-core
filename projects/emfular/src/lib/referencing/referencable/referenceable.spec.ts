import {Referencable1WithChildren, Referencable2WithChildren, Referencable3WithChildren} from "../test/referencables-with-children";

describe('Referenceable', () => {

  it ('should prepare a Referencable1WithChildren correctly', () => {
    let r1 : Referencable1WithChildren = new Referencable1WithChildren({$ref: 'r1', eClass: "Referencable1WithChildren"});
    let r2_1: Referencable2WithChildren = new Referencable2WithChildren({$ref: 'r2_1', eClass: "Referencable2WithChildren"});
    let r2_2: Referencable2WithChildren = new Referencable2WithChildren({$ref: 'r2_2', eClass: "Referencable2WithChildren"});
    r1.addc1_1(r2_1, r2_2)
    let r3_1: Referencable3WithChildren = new Referencable3WithChildren({$ref: 'r3_1', eClass: "Referencable3WithChildren"});
    r2_1.addc2_1(r3_1)
    r3_1.addc1_2_reversed(r1)

    expect(r1.getRef().$ref).toBe('r1')
    r1.prepare("/")
    expect(r1.getRef().$ref).toBe('/')
    expect(r3_1.getRef().$ref).toBe('//@c1_1.0/@c2_1.0')
  })

  it('should deserialize and serialize a JSON with missing arrays', () => {
    let json = '{' +
        'c1_1: [' +
          '{' +
            'c2_1: [' +
              '{},' +
              '{}' +
            ']' +
          '}' +
        ']'+
        '}'
    //let jsonObj: Referencable1WithChildrenJson = JSON.parse(json) as Referencable1WithChildrenJson
    //todo: need to deserialize and reserialze it - make sure that the empty lists are not in the JSON to enforce visiting the null entries on jsonELEm in addReferences

  });

})
