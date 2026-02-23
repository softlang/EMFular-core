export enum DeletionMode {
    CASCADE = "CASCADE", // delete all classes that become inconsistent after deletion
    RELAXED = "RELAXED" // delete only the specified class, even if it leaves the model in an inconsistent state
}