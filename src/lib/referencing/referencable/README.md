# Referencable model API

`Referencable` is the base class for generated model elements. Model classes
normally expose references as properties decorated with `@reference`. The
property type and metadata determine whether a reference is a containment,
non-containment, parent, or derived reference, and whether it contains one
object or a list. This README describes the API used when creating and editing models.

## References

### Single-valued references

A single-valued reference is read and written like a normal property:

```ts
book.author = author;
const author = book.author;
book.author = undefined; // clears the reference
```

Assigning a new value updates the reference. If the reference declares an
opposite, the opposite reference is updated as well. Values must be instances
of the reference's declared target class.

### List-valued references

A multi-valued reference is exposed as a controlled, array-like model list:

```ts
book.chapters.push(chapter);
book.chapters.remove(chapter);
book.chapters.removeCascade(chapter);
```

Model lists support normal read operations such as indexing, iteration,
`length`, and array helpers. Use list operations rather than assigning an
index or replacing the list:

```ts
for (const chapter of book.chapters) {
  // ...
}

book.chapters[0] = anotherChapter; // unsupported
book.chapters = [];                // unsupported
```

The mutation operations are:

- `push(...items)`, `pop()`, `shift()`, and `splice(...)` add and remove
  referenced objects while preserving reference bookkeeping.
- `remove(...items)` removes objects from the reference without destructing
  them.
- `removeCascade(...items)` removes and destructs the selected objects.
- `delete()` removes and destructs every object in the list.
- `move(from, to)` and `swap(from, to)` reorder the list.

Containment lists own their children, so destructing or cascading removal of a
contained object also removes it from the model tree. Link lists only manage
the relationship; configured opposite references are kept in sync.

## Derived and parent references

Derived references are read-only. Their value is computed by the derivation
function declared by the model, so they cannot be assigned, added to, removed
from, or reordered.

A parent reference is a read-only view of the element's containment parent. For
general parent lookup, use `$getEParent()` on the model element:

```ts
const parent = chapter.$getEParent();
```

It returns `undefined` when the element is not currently contained.

## `Referencable` methods and properties

### `$getEClass()`

Returns the registered eClass identifier for the instance.

### `$getEParent()`

Returns the current containment parent, or `undefined` for a root object.

### `$destruct(mode?)`

Removes the object from its parent, removes its inverse links, and destructs
its contained children. The optional deletion mode controls how linked and
contained objects are cleaned up; omit it for the default relaxed behavior.

Use this when an object and its owned subtree should be removed from the model.
For removing an item from a list without destructing it, use `remove()` on the
reference instead.

### `toJson()`

Serializes the object and its model subtree to the repository's JSON model
format. Calling it on any contained object serializes the complete tree from
the root and includes references using model `Ref` values.

### `collectConstraintViolations()` and `$violations`

Call `collectConstraintViolations()` to validate the current model subtree.
It checks each object in the containment tree, clears the local violation map,
and rebuilds violations for derived references, required parent references,
link cardinality, and tree-child cardinality. It also detects cycles while
walking the tree.

The method returns a nested `Map<string, Map<string, string>>` keyed first by
object `$gId`, then by reference name. The current object's local map is also
available through `$violations`:

```ts
const violations = model.collectConstraintViolations();

for (const [gId, refViolations] of violations) {
  for (const [referenceName, message] of refViolations) {
    console.warn(gId, referenceName, message);
  }
}

for (const [referenceName, message] of model.$violations) {
  console.warn(referenceName, message);
}
```

Validation is not triggered automatically after every mutation; you must call
`collectConstraintViolations()` when you want to inspect the current state.
