import {Ref} from "./ref";

export class RefHandler {

    static readonly pathDivider: string = '/@';

    static getIndexFromString(ref: string): number {
        let substrings = ref.split('.');
        return parseInt(substrings[substrings.length-1]);
    }

    static computePrefix(formerPrefix: string, ownHeader: string): string {
        return formerPrefix+RefHandler.pathDivider+ownHeader;
    }

    static getParentAddress(ref: string): string {
        let pos = ref.lastIndexOf(this.pathDivider)
        return ref.substring(0, pos)
    }

    static mixWithIndex(prefix: string, index: number): string {
        return prefix+'.'+index;
    }

    static createRef(ref: string, eClass: string): Ref {
        return {
            $ref: ref,
            eClass: eClass
        }
    }

    static createRefIfMissing(eClass: string, ref?: Ref) {
        return ref? ref: {$ref: '', eClass: eClass};
    }
}
