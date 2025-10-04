import "reflect-metadata";

import { DIContainer as Container } from "./DIContainer";
import { type IDIContainer } from "./IDIContainer";

export { inject as Inject } from "tsyringe";
const DIContainer = new Container();
export { DIContainer, type IDIContainer };
