const passport = require("passport");
const { Strategy } = require("passport-strategy");

class CustomStrategy extends Strategy {
    constructor(verify) {
        super();
        this.name = "custom";
        this.verify = verify;
    }

    authenticate(req) {
        const token = req.headers["x-custom-token"];
        
        if (!token) {
            return this.fail({ message: "No token provided" }, 401);
        }

        this.verify(token, (err, user, info) => {
            if (err) {
                return this.error(err);
            }
            if (!user) {
                return this.fail(info, 401);
            }
            return this.success(user, info);
        });
    }
}

module.exports = CustomStrategy;
