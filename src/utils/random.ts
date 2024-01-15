function generateRandomString(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }

  return result;
}

function generateRandomInt(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

export { generateRandomString, generateRandomInt };