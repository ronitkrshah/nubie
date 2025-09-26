# Introduction

**Nubie** is a small yet powerful framework built on top of [Express](https://expressjs.com/), designed to simplify backend development using modern TypeScript features.

Unlike traditional Express apps where routing and middleware logic can quickly become cluttered, Nubie provides a **structured and decorator-driven approach** similar to what you'd find in .NET WebAPI. This makes it easy to build scalable and maintainable APIs with minimal boilerplate.

Nubie is ideal for developers who love:

- Type safety
- Clear project structure
- Convention over configuration
- Modern, declarative programming patterns

## How Does It Work?

Nubie wraps Express under the hood but introduces a clean abstraction layer that lets you define your API endpoints using **TypeScript decorators**.

Here’s what working with Nubie typically looks like:

- Define controllers using `@Controller()` decorators
- Create routes with method-specific decorators like `@Get()`, `@Post()`, etc.
- Use dependency injection for services and utilities
- Let Nubie auto-register and wire everything with minimal setup

### Example

```ts
import { ApiController, HttpGet, HttpResponse } from "@nubie/framework";

@ApiController()
export default class HelloController {
    @HttpGet("/")
    public getHello() {
        return HttpResponse.Ok({ message: "Hello from Nubie!" });
    }
}
```

The code above automatically sets up a `GET` endpoint at `/api/v1/hello`, without the need to manually register routes or write repetitive boilerplate.

## What Does It Come With?

Nubie provides all the essentials you need to build a modern Web API:

### Core Features

- **Decorator-based routing** — Inspired by .NET and Angular, for intuitive route declarations
- **Built-in DI container** — Lightweight dependency injection with class-based services
- **Minimal configuration** — Sensible defaults that get you started quickly
- **Structured project organization** — Keep your codebase modular and maintainable

### Plugin-Friendly

- **Extensible** - You can plug in middlewares, use your own custom decorators.

### Out-of-the-Box Tools

- Request validation
- JWT Auth
- Automatic JSON responses
- Error handling helpers
- Easy Socket IO Setup (Beta)

## Why Choose Nubie?

If you're looking for the simplicity of Express with the structure of .NET, Nubie gives you the best of both worlds — with TypeScript as a first-class citizen.

Think of Nubie as the "TypeScript WebAPI for Node.js" — fast, clean, and built for productivity.
