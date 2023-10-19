import { Fn } from 'cdktf';

export function randomFnValue(arr: string[], length: number) {
    return Fn.element(arr, Math.floor(Math.random() * length));
}
