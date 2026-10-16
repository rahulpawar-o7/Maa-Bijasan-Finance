import { checkIndianMobile, EMPTY_VALUES, validateEnquiry } from "./validation";

describe("checkIndianMobile", () => {
  it.each([
    ["9876543210", "9876543210"],
    ["98765 43210", "9876543210"],
    ["+91 98765 43210", "9876543210"],
    ["+91-98765-43210", "9876543210"],
    ["919876543210", "9876543210"],
    ["09876543210", "9876543210"],
    ["6000000001", "6000000001"],
  ])("accepts %s", (input, expected) => {
    expect(checkIndianMobile(input)).toEqual({ ok: true, value: expected });
  });

  it.each([
    ["", /enter your mobile/i],
    ["98765", /must be 10 digits/i],
    ["98765432101", /must be 10 digits/i],
    ["5876543210", /start with 6, 7, 8 or 9/i],
    ["abcdefghij", /digits only/i],
    ["9999999999", /does not look valid/i],
    ["+91 12345", /must be 10 digits/i],
  ])("rejects %s", (input, message) => {
    const r = checkIndianMobile(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(message);
  });
});

describe("validateEnquiry", () => {
  const valid = {
    ...EMPTY_VALUES,
    fullName: "Ramesh Sharma",
    mobile: "9876543210",
    city: "Indore",
    loanType: "Home Loan",
    loanAmount: "Not Sure Yet",
    contactTime: "10 AM – 12 PM",
    consent: true,
  };

  it("passes with only required fields", () => {
    expect(validateEnquiry(valid)).toEqual({});
  });

  it("flags every required field when empty", () => {
    const errors = validateEnquiry(EMPTY_VALUES);
    expect(Object.keys(errors).sort()).toEqual(
      ["city", "consent", "contactTime", "fullName", "loanAmount", "loanType", "mobile"].sort(),
    );
  });

  it("requires consent", () => {
    expect(validateEnquiry({ ...valid, consent: false }).consent).toBeDefined();
  });

  it("validates optional email only when provided", () => {
    expect(validateEnquiry({ ...valid, email: "" }).email).toBeUndefined();
    expect(validateEnquiry({ ...valid, email: "not-an-email" }).email).toBeDefined();
    expect(validateEnquiry({ ...valid, email: "a@b.in" }).email).toBeUndefined();
  });

  it("rejects values not in the allowed option lists", () => {
    expect(validateEnquiry({ ...valid, loanType: "Gold Loan" }).loanType).toBeDefined();
  });

  it("accepts non-English names", () => {
    expect(validateEnquiry({ ...valid, fullName: "रमेश शर्मा" }).fullName).toBeUndefined();
  });
});
