import {ModelDefinition} from "./model-definition";

export function resolveOpposites(model: ModelDefinition) {
    for (const [className, cls] of Object.entries(model.classes)) {
        for (const [refName, meta] of Object.entries(cls.references)) {

            if (meta.opposite && !meta.oppositeContainerKey) {
                const oppositeClass = meta.target;
                const oppositeRef = meta.opposite;

                const oppositeMeta =
                    model.classes[oppositeClass]?.references[oppositeRef];

                meta.oppositeContainerKey = oppositeMeta?.containerKey;
            }
        }
    }
}
