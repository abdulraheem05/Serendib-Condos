import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry, buildEnquiryMail } from "../lib/enquiry.js";
const enquiry = { name: "Test Visitor", phone: "+1 (416) 555-0123", email: "visitor@example.com", message: "Please share details." };
test("required fields, invalid contacts and header injection are rejected", () => {
  for (const data of [null, {}, [], { ...enquiry, name: " " }, { ...enquiry, email: "bad" }, { ...enquiry, email: "a@example.com\r\nBcc:other@example.com" }, { ...enquiry, phone: "invalid" }, { ...enquiry, message: "x".repeat(5001) }, { ...enquiry, projectId: "not-a-project" }]) assert.ok(validateEnquiry(data).error);
  assert.ok(validateEnquiry(enquiry).values);
});
test("project email contains authoritative project identity and all submitted details", () => {
  const { values, project } = validateEnquiry({ ...enquiry, projectId: "aurora", projectName: "Fake name" });
  const mail = buildEnquiryMail(values, project, "sender@example.com");
  assert.equal(mail.to, "hello@serendibcondos.com");
  assert.equal(mail.replyTo, enquiry.email);
  assert.match(mail.subject, /Aurora Residences/);
  assert.match(mail.text, /Project ID: aurora/);
  assert.ok(!mail.text.includes("Fake name"));
  for (const value of Object.values(enquiry)) assert.ok(mail.text.includes(value));
});
test("general consultation email has no project attribution", () => {
  const { values, project } = validateEnquiry(enquiry);
  const mail = buildEnquiryMail(values, project, "sender@example.com");
  assert.match(mail.subject, /consultation enquiry/);
  assert.ok(!mail.text.includes("Project ID:"));
});
