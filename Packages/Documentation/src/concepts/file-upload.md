# File Uploads

Nubie supports elegant file uploads through its `@FileUpload()` decorator, enabling both simple and advanced handling via middleware injection.

## Decorator Overview

`@FileUpload()` is a method-level decorator that attaches middleware to a route to handle file uploads of different types: single file, multiple files, or field-based grouping.

::: info
Create `uploads` directory on project root before using file upload decorators.
:::

### Import

```ts
import { FileUpload, FileUploadType } from "@nubie/framework";
```

## Syntax & Options

```ts
@FileUpload(field, uploadType?, maxCount?)
```

| Parameter    | Type                        | Description                            |
| ------------ | --------------------------- | -------------------------------------- |
| `field`      | `string` \| `TUploadFields` | Field name or list of fields           |
| `uploadType` | `FileUploadType`            | Type of upload (defaults to `Single`)  |
| `maxCount`   | `number`                    | Only for `Multiple` type. Default: `2` |

## Upload Types

The decorator supports three file upload modes:

| Type     | Enum Value                | Description                               |
| -------- | ------------------------- | ----------------------------------------- |
| Single   | `FileUploadType.Single`   | Upload one file using a single field name |
| Multiple | `FileUploadType.Multiple` | Upload multiple files with one field name |
| Fields   | `FileUploadType.Fields`   | Upload files mapped to multiple fields    |

### Single File Upload

```ts
@Post("/profile")
@FileUpload("avatar", FileUploadType.Single)
async updateProfileAsync(@File() file: Express.Multer.File) {
}
```

### Multiple File Upload

```ts
@FileUpload("photos", FileUploadType.Multiple, 5)
@Post("/album")
async uploadPhotosAsync(@Files() files: Express.Multer.File[]) {
}
```

### Field-Based Uploads

```ts
@FileUpload([
  { name: "avatar", maxCount: 1 },
  { name: "cover", maxCount: 3 }
])
@Post("/photos")
async applyForJobAsync(@Files() files: Record<string, Express.Multer.File[]>) {
}
```

## Notes

- The default `maxCount` for multiple uploads is `2` if not specified.
