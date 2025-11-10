import "reflect-metadata";

import { GlobalContainer } from "./Container";
import { type IContainer } from "./IContainer";

export { inject as Inject } from "tsyringe";

export * from "./decorators";
export { GlobalContainer, type IContainer };
