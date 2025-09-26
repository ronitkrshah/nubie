# Error Handling

Nubie provides a flexible mechanism for handling application errors through the `setErrorHandler()` method.  
This allows you to define a **custom error handler** or rely on Nubie’s **default error response format**.

### Parametres

| Parameter    | Type     | Required | Description                                                                               |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------------- |
| errorHandler | Function | No       | Custom error handling function. Receives the error, request, response, and next function. |
