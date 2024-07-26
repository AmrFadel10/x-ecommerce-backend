class ApiHandler extends Error {
	constructor(statusCode, message) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "Error";
		this.isoperation = true;
	}
}

module.exports = ApiHandler;
