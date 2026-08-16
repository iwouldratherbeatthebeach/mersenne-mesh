export async function submitAuthProvider(
  provider: "google" | "resend",
  options: { email?: string; callbackUrl?: string } = {},
) {
  const csrfResponse = await fetch("/api/auth/csrf", { credentials: "same-origin" });
  if (!csrfResponse.ok) throw new Error("Authentication is not configured.");
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const form = document.createElement("form");
  form.method = "post";
  form.action = `/api/auth/signin/${provider}`;

  const values: Record<string, string> = {
    csrfToken,
    callbackUrl: options.callbackUrl ?? `${window.location.origin}/account`,
  };
  if (options.email) values.email = options.email;

  for (const [name, value] of Object.entries(values)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export async function signOut() {
  const csrfResponse = await fetch("/api/auth/csrf", { credentials: "same-origin" });
  if (!csrfResponse.ok) throw new Error("Unable to sign out.");
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };
  const form = document.createElement("form");
  form.method = "post";
  form.action = "/api/auth/signout";
  for (const [name, value] of Object.entries({
    csrfToken,
    callbackUrl: `${window.location.origin}/`,
  })) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
