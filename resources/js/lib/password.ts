import { STORAGE_KEYS } from "@/lib/constants";
import type { UserAccount } from "@/lib/types";

// ======================================================
// READ USERS
// ======================================================

function readUsers(): UserAccount[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEYS.users,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as UserAccount[];
  } catch {
    return [];
  }
}

// ======================================================
// SAVE USERS
// ======================================================

function saveUsers(
  users: UserAccount[],
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEYS.users,
    JSON.stringify(users),
  );
}

// ======================================================
// FIND USER
// ======================================================

export function findUserByUsernameAndEmail(
  username: string,
  email: string,
): UserAccount | null {
  const normalizedUsername =
    username.trim().toLowerCase();

  const normalizedEmail =
    email.trim().toLowerCase();

  const users =
    readUsers();

  const user =
    users.find(
      (row) =>
        row.username
          .trim()
          .toLowerCase() ===
          normalizedUsername &&
        row.email
          .trim()
          .toLowerCase() ===
          normalizedEmail,
    );

  return user ?? null;
}

// ======================================================
// VERIFY CURRENT PASSWORD
// ======================================================

export function verifyUserPassword(
  username: string,
  password: string,
): boolean {
  const normalizedUsername =
    username.trim().toLowerCase();

  const users =
    readUsers();

  const user =
    users.find(
      (row) =>
        row.username
          .trim()
          .toLowerCase() ===
        normalizedUsername,
    );

  if (!user) {
    return false;
  }

  return user.password === password;
}

// ======================================================
// UPDATE PASSWORD
// ======================================================

export function updateUserPassword(
  username: string,
  newPassword: string,
): {
  ok: boolean;
  message: string;
} {
  const normalizedUsername =
    username.trim().toLowerCase();

  const trimmedPassword =
    newPassword.trim();

  if (!trimmedPassword) {
    return {
      ok: false,
      message:
        "Password baru wajib diisi.",
    };
  }

  if (trimmedPassword.length < 6) {
    return {
      ok: false,
      message:
        "Password minimal 6 karakter.",
    };
  }

  const users =
    readUsers();

  const index =
    users.findIndex(
      (row) =>
        row.username
          .trim()
          .toLowerCase() ===
        normalizedUsername,
    );

  if (index === -1) {
    return {
      ok: false,
      message:
        "Akun tidak ditemukan.",
    };
  }

  users[index] = {
    ...users[index],
    password:
      trimmedPassword,
  };

  saveUsers(users);

  return {
    ok: true,
    message:
      "Password berhasil diperbarui.",
  };
}

// ======================================================
// RESET PASSWORD
// ======================================================

export function resetPasswordByUsernameAndEmail(
  username: string,
  email: string,
  newPassword: string,
): {
  ok: boolean;
  message: string;
} {
  const user =
    findUserByUsernameAndEmail(
      username,
      email,
    );

  if (!user) {
    return {
      ok: false,
      message:
        "Username dan email tidak sesuai.",
    };
  }

  return updateUserPassword(
    user.username,
    newPassword,
  );
}
