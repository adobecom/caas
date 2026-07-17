// DEMO: intentional bugs to test AI Code Review (revert before merge).
// Not imported anywhere; exists purely so the reviewer has something to flag.

function getFirstTagId(card) {
  // Bug: no guard -- throws TypeError when card.tags is undefined or empty.
  return card.tags[0].id.toUpperCase();
}

function isAdmin(user) {
  // Bug: assignment (=) instead of comparison (===) inside the condition.
  // This overwrites user.role and always returns true -- grants admin to everyone.
  if (user.role = 'admin') {
    return true;
  }
  return false;
}

module.exports = { getFirstTagId, isAdmin };
