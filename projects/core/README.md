# EMFular

This small TS library deals with the conversion between "flat" model representations of [emf-jackson](https://emfjson.github.io/projects/jackson/latest/), which we call **json** representation, and a traversable in-memory representation which we call **core** representation.
Basically, it converts the XPath-based references of [emf-jackson](https://emfjson.github.io/projects/jackson/latest/) into object references and vice versa.
It consists of two parts:
1. **Referencing:** defines the main properties both for the json (flat) and the core (traversable) representation. It also holds methods for serialization.
2. **Deserialization:** deals with the conversion of json models into core models.

## Referencing
Referencing consists of two classes:
 * The **Ref** class consists of an XPath reference $ref and the EClass eClass. It holds basic facilities to work with XPath, including traversal and path concatenation and is the basis for working with references in the JSON form that emf-jackson exports.
 * The **Referencable** class defines a contract for the core representation: Referencables have a UUID gId which is used for global identification and cross-referencing on graphical components. There are also references to all EMF-tree-children. These relationships are used on object creation and destruction. Each object also holds a Ref which might be out-dated but is updated and used on serialization into json. The necessary methods to prepare the XPath references are included.

## Deserialization

Deserialization handles the construction of the core model from the json model.
We handle the replacement of Ref references by object references during object construction. 
Hence, we need a deserializer that manages the already created objects and constructs new ones on demand.
Basically, the whole construction process is triggered by calling the constructor of the EMF model's root element with the deserializer as only parameter.

The objects' constructors are responsible for the correct creation of their representations.
The deserializer offers general methods to help them and relies on certain types, that the library exposes:

* **Deserializer context management:** The deserializer stores objects via put, and delivers objects on getOrCreate(ref: Ref). (See below for an explanation of the creation process).
* **Access to json parts:** There is a method getJsonFromTree($ref: string) to get the json for a specific XPath.
* **Helper methods:** Additionally, there are methods to adapt eClasses. Emf-jackson sometimes omits them but since our deserialization heavily relies on them, we need to set them right upfront.

### Object Creation by the Deserializer
The creation of new objects relies on a **ConstructorPointer** that should be available for the type of the object that is identified by its EClass.
These pointers for all EClasses are a necessary parameter when creating a deserializer.
``export type ConstructorPointer = ($ref:string) => (p: Deserializer) => Referencable;``
The definition of these pointers must be handled by the programmer.

We recommend to write the ConstructorPointer so that it first sets the complete Ref and then calls a (dummy) constructor with the deserializer and the Ref as parameters. There is a typed helper ConstructorPointerFor<T> for all ConstructorPointer definitions.
The deserializer based object construction needs to be done on the constructor. This way, the object can be put into the deserializer as soon as it exists.
The deserializer offers the method getJsonFromTree($ref: string) to access all relevant attributes and XPath references from the json model.

In our current reference implementation, [KEML.web](https://github.com/keml-group/keml.web), the interplay of deserializer and constructors is visible.
