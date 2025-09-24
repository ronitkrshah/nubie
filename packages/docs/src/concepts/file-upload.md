# File Uploads

Nubie supports elegant file uploads through its `@FileUpload()` decorator, enabling both simple and advanced handling via middleware injection.

## Decorator Overview

`@FileUpload()` is a method-level decorator that attaches middleware to a route to handle file uploads of different types: single file, multiple files, or field-based grouping.

### Import

```ts
import { FileUpload, FileUploadType } from "nubie";
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

## Examples

### Single File Upload

```ts
@FileUpload("avatar", FileUploadType.Single)
@Post("/profile")
async updateProfileAsync(@File() file: MulterFile) {
}
```

### Multiple File Upload

```ts
@FileUpload("photos", FileUploadType.Multiple, 5)
@Post("/album")
async uploadPhotosAsync(@Files() files: MulterFile[]) {
}
```

### Field-Based Uploads

```ts
@FileUpload([
  { name: "resume", maxCount: 1 },
  { name: "certificates", maxCount: 3 }
])
@Post("/job/apply")
async applyForJobAsync(@Files() files: MulterFile[]) {
}
```

## Notes

- The default `maxCount` for multiple uploads is `2` if not specified.
