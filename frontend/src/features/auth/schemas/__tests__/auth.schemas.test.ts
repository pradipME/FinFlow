import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  otpSchema,
} from "../auth.schemas";

describe("loginSchema", () => {
  it("accepts valid identifier and password", () => {
    const result = loginSchema.safeParse({
      identifier: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty identifier", () => {
    const result = loginSchema.safeParse({ identifier: "", password: "pass" });
    expect(result.success).toBe(false);
  });

  it("rejects identifier shorter than 3 chars", () => {
    const result = loginSchema.safeParse({ identifier: "ab", password: "pass" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      identifier: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts username as identifier", () => {
    const result = loginSchema.safeParse({
      identifier: "johndoe",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });
});

describe("registerSchema", () => {
  const valid = {
    email: "user@example.com",
    username: "johndoe",
    password: "Passw0rd!",
    confirmPassword: "Passw0rd!",
    phoneNumber: "+1234567890",
    termsAccepted: true,
  };

  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects without phone number (required)", () => {
    const { phoneNumber: _, ...withoutPhone } = valid;
    const result = registerSchema.safeParse(withoutPhone);
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "Different1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password (no uppercase)", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "passw0rd!",
      confirmPassword: "passw0rd!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password (no special char)", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "Passw0rd1",
      confirmPassword: "Passw0rd1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "Ab1!",
      confirmPassword: "Ab1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid username (special chars)", () => {
    const result = registerSchema.safeParse({
      ...valid,
      username: "user@name",
    });
    expect(result.success).toBe(false);
  });

  it("rejects username shorter than 3 chars", () => {
    const result = registerSchema.safeParse({
      ...valid,
      username: "ab",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when terms not accepted", () => {
    const result = registerSchema.safeParse({
      ...valid,
      termsAccepted: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone number format", () => {
    const result = registerSchema.safeParse({
      ...valid,
      phoneNumber: "not-a-phone",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "bad" });
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching strong passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Passw0rd!",
      confirmPassword: "Passw0rd!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Passw0rd!",
      confirmPassword: "Different1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password", () => {
    const result = resetPasswordSchema.safeParse({
      password: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });
});

describe("otpSchema", () => {
  it("accepts 6-digit OTP", () => {
    const result = otpSchema.safeParse({ otp: "123456" });
    expect(result.success).toBe(true);
  });

  it("rejects non-numeric OTP", () => {
    const result = otpSchema.safeParse({ otp: "12345a" });
    expect(result.success).toBe(false);
  });

  it("rejects short OTP", () => {
    const result = otpSchema.safeParse({ otp: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects long OTP", () => {
    const result = otpSchema.safeParse({ otp: "1234567" });
    expect(result.success).toBe(false);
  });
});