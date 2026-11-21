const MOCK_DELAY_MS = 600;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function logIn(email, password) {
  await wait(MOCK_DELAY_MS);
  return { id: 'demo-user', name: 'Alex', email: email.trim() };
}

export async function register({ name, email, password }) {
  await wait(MOCK_DELAY_MS);
  return { id: 'demo-user', name: name.trim(), email: email.trim() };
}

export async function sendPasswordReset(email) {
  await wait(MOCK_DELAY_MS);
}
