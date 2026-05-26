export type Kind = "tree" | "link" | "none";

export type KindFromMeta<R> =
    R extends { containment: true } ? "tree"
        : R extends { isParent: true } ? "none"
            : R extends { derivingMethod: symbol } ? "none"
                : "link";