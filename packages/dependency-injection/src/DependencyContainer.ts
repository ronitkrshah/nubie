import { container, injectable, Lifecycle } from "tsyringe";
import type { IDependencyContainer, TClass } from "./IDependencyContainer";

export default class DependencyContainer implements IDependencyContainer {
    public registerClass(token: string, ctor: TClass, lifecycle: Lifecycle = Lifecycle.ContainerScoped): void {
        container.register(token, { useClass: ctor }, { lifecycle });
    }

    public markAsInjectable(ctor: TClass): void {
        injectable()(ctor);
    }

    public contains(token: string): boolean {
        return container.isRegistered(token);
    }

    public resolveInstance<TInstance extends object>(token: string): TInstance | null {
        return container.resolve(token);
    }
}
