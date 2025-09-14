import { container, injectable, Lifecycle as ContainerLifecycle } from "tsyringe";
import { TConstructor } from "../../types";

export const enum Lifecycle {
    Singleton,
    Transient,
    Scoped,
}

export default function Injectable(token: string, lifecycle: Lifecycle = Lifecycle.Scoped) {
    return function (target: TConstructor) {
        injectable()(target);
        let containerLifecycle = ContainerLifecycle.ContainerScoped;

        switch (lifecycle) {
            case Lifecycle.Singleton:
                containerLifecycle = ContainerLifecycle.Singleton;
                break;
            case Lifecycle.Transient:
                containerLifecycle = ContainerLifecycle.Transient;
                break;
            case Lifecycle.Scoped:
                containerLifecycle = ContainerLifecycle.ContainerScoped;
                break;
            default:
                containerLifecycle = ContainerLifecycle.ContainerScoped;
        }

        container.register(
            token,
            {
                useClass: target,
            },
            { lifecycle: containerLifecycle },
        );
    };
}
