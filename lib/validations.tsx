export type PasswordRules = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  digit: boolean;
  special: boolean;
  confirmMatch: boolean;
};

export function getPasswordRules(
  password: string,
  confirm?: string
): PasswordRules {
  return {
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?`~]/.test(password),
    confirmMatch:
      typeof confirm === "string" && confirm.length
        ? password === confirm
        : false,
  };
}

export function isPasswordStrong(password: string, confirm?: string) {
  const r = getPasswordRules(password, confirm);
  return (
    r.length && r.upper && r.lower && r.digit && r.special && r.confirmMatch
  );
}
