import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("nested case-insensitive keys", () => {
  const x = { Password: "secret", nested: [{ token: "abc", ok: 1 }] };
  const r = api.maskSecrets(x);
  assert.equal(r.Password, "[REDACTED]");
  assert.equal(r.nested[0].token, "[REDACTED]");
  assert.equal(x.Password, "secret");
});
test("cycles", () => {
  const x = {};
  x.self = x;
  assert.equal(api.maskSecrets(x).self, "[Circular]");
});
test("custom keys", () =>
  assert.equal(api.maskSecrets({ email: "a" }, ["email"], "***").email, "***"));
