export type Kind = "tree" | "link" | "none";

export type KindFromMeta<R> =
    R extends { isParent: true } ? "none" :
        R extends { derivingMethod: symbol } ? "none" :
            R extends { containment: true } ? "tree" :
                "link";