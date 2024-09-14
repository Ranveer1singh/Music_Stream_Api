class apiError extends Error {
    constructor(
      statusCode,
      message = "Something went wrong",
      error = [],
      stack = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.message = message;
      this.error = error;
      this.success = false;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  
    // This ensures the error is serialized correctly
    toJSON() {
      return {
        statusCode: this.statusCode,
        message: this.message,
        success: this.success,
        error: this.error,
        stack: process.env.NODE_ENV === "development" ? this.stack : undefined, // Only show stack in dev
      };
    }
  }
  
  module.exports = apiError;
  