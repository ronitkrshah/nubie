import "reflect-metadata"
import type { IDependencyContainer } from "./IDependencyContainer";
import DependencyContainer from "./DependencyContainer";
import type { Lifecycle } from "tsyringe";
import inject from "tsyringe";

export type { IDependencyContainer, Lifecycle };
export const Container = new DependencyContainer();
export { inject as Inject };
