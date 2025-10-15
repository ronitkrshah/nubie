import { GlobalContainer } from "../Container";

export function Injectable() {
    return function (target: TClass) {
        GlobalContainer.markAsInjectable(target);
    };
}
