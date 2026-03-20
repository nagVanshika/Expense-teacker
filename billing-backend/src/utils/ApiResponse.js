class ApiResponse {
  constructor(success, message = 'Success', data = null, error = null) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
    if (error) this.error = error;
  }

  static success(data, message = 'Success') {
    return new ApiResponse(true, message, data);
  }

  static error(error, message = 'Error', statusCode = 500) {
    return {
      statusCode,
      response: new ApiResponse(false, message, null, error)
    };
  }
}

module.exports = ApiResponse;
