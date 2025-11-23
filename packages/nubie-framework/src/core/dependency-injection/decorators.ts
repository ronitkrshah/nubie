import { injectable } from "tsyringe";
import ServiceContainer from "./ServiceContainer";

export { inject as Inject } from "tsyringe";

export function Injectable() {
    return function (target: TClass) {
        injectable()(target);
    };
}

export function Scoped(token: symbol | string) {
    return function (target: TClass) {
        ServiceContainer.addScoped(token, target);
    };
}

export function Singleton(token: symbol | string) {
    return function (target: TClass) {
        ServiceContainer.addSingleton(token, target);
    };
}

export function Transient(token: symbol | string) {
    return function (target: TClass) {
        ServiceContainer.addTransient(token, target);
    };
}
