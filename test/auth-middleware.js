const expect = require("chai").expect;

const authMiddleware = require("../middleware/is-auth");

describe("Auth Middleware", function () {
  it("should throw an error if no authentication header is present", function () {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not Authenticated"
    );
  });

  it("should throw error if the authoriation header is only one string", function () {
    const req = {
      get: function () {
        return "abc";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
