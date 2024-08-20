"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return function (req, res, next) {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            res
                .status(400)
                .json({ message: "Validation error", errors: error.errors });
        }
    };
}
