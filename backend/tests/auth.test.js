const request = require("supertest")
const sinon = require("sinon")
const { expect } = require("chai")
const app = require("../src/app")
const um = require("../src/models/user.model")
const pu = require("../src/utils/password")
const jw = require("../src/utils/jwt")

afterEach(() => {
  sinon.restore()
})

describe("POST /api/auth/register", function () {

  it("should return 400 if email already exists", async function () {
    var user = sinon.stub(um, "findUserByEmail").resolves({ id: 1 })

    var res = await request(app).post("/api/auth/register").send({
      username: "talha",
      email: "talha@example.com",
      password: "Pass123!"
    })

    expect(res.status).to.equal(400)
  })

  it("registers user successfully - 201", async function () {
    sinon.stub(um, "findUserByEmail").resolves(null)
    sinon.stub(um, "findUserByUsername").resolves(null)
    sinon.stub(pu, "hashPassword").resolves("hashed")
    sinon.stub(um, "createUser").resolves({
      id: 1,
      username: "talha",
      email: "talha@example.com",
      full_name: null,
      created_at: new Date()
    })
    sinon.stub(jw, "generateTokens").returns({ accessToken: "acc", refreshToken: "ref" })

    const res = await request(app).post("/api/auth/register").send({
      username: "talha", email: "talha@example.com", password: "Pass123!"
    })

    expect(res.status).to.equal(201)
    expect(res.body.success).to.equal(true)
  })

})


describe("POST /api/auth/login", () => {
  it("401 when user doesnt exist", async () => {
    sinon.stub(um, "findUserByEmail").resolves(null)
    sinon.stub(um, "findUserByUsername").resolves(null)

    let r = await request(app).post("/api/auth/login").send({
      login: "nobody@example.com",
      password: "Pass123!"
    })

    expect(r.status).to.equal(401)
  })

  it("200 login works fine",
    async () => {
      let u = {
        id: 1,
        username: "talha",
        email: "talha@example.com",
        full_name: "Talha",
        is_active: true,
        password_hash: "hash"
      }

      sinon.stub(um, "findUserByEmail").resolves(u)
      sinon.stub(pu, "comparePassword").resolves(true)
      sinon.stub(um, "updateLastLogin").resolves()
      sinon.stub(jw, "generateTokens").returns({ accessToken: "acc", refreshToken: "ref" })

      let r = await request(app).post("/api/auth/login").send({ login: "talha@example.com", password: "Pass123!" })

      expect(r.status).to.equal(200)
      expect(r.body.tokens.accessToken).to.equal("acc")
    })
})

describe("GET /api/auth/me", function () {

  it("no token = 401",
    async () => {
      let res = await request(app).get("/api/auth/me")
      expect(res.status).to.equal(401)
    })

  it("valid token gives 200", async () => {
    sinon.stub(jw, "verifyAccessToken").returns({ id: 1 })
    sinon.stub(um, "findUserById").resolves({ id: 1, username: "talha", is_active: true })

    let res = await request(app).get("/api/auth/me").set("Authorization", "Bearer sometoken")

    expect(res.status).to.equal(200)
    expect(res.body.user.username).to.equal("talha")
  })
})