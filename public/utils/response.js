class Response {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    getStatus() {
        return this.status;
    }

    getData() {
        return this.data;
    }

    getMessage() {
        return this.message;
    }
}

module.exports = Response;