import { injectable } from "tsyringe";

export function Injectable() {
    return function (target: TClass) {
        injectable()(target);
    };
}
