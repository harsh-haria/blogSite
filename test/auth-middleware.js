const expect = require("chai").expect;
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/is-auth");

describe("Auth Middleware", function () {
  it("should throw an error if no authentication header is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not Authenticated"
    );
  });

  it("should throw error if the authoriation header is only one string", function () {
    const req = {
      get: function (headerName) {
        return "abc";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verifed", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer fsdjlknfwadfsa.alsrhawse.dasedawd";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    // //stub starts here
    // jwt.verify = function () {
    //   return { userId: "abc" };
    // };
    // //stub ends here
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore(); //this is used so that other tests do not get manipulated do to the stub we created for this test.
  });
});
