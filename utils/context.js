const userStates = new Map();

export function setUserState(userId, state) {
  userStates.set(userId, state);
}

export function getUserState(userId) {
  return userStates.get(userId);
}

export function clearUserState(userId) {
  userStates.delete(userId);
}
