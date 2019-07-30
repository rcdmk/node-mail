class DomainError extends Error {
  constructor(message) {
    super(message);
    // Set error name to class name
    this.name = this.constructor.name;
    // remove constructor from stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResourceNotFoundError extends DomainError {
  constructor(resource, query) {
    super(`Resource ${resource} was not found.`);
    this.data = {
      resource,
      query
    };
  }
}

class InternalError extends DomainError {
  constructor(error) {
    super(error && error.message ? error.message : error);
    this.data = {
      error
    };
  }
}

class ValidationError extends DomainError {
  constructor(field, message) {
    super(`${field}: ${message}`);
    this.data = {
      field,
      message
    };
  }
}

module.exports = {
  InternalError,
  ResourceNotFoundError,
  ValidationError
};
