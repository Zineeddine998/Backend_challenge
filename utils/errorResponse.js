class ErrorResponse extends Error {
    constructor(message, stausCode) {
        super(message);
        this.stausCode = stausCode;
    }
}

module.exports = ErrorResponse;