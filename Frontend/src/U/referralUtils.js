// referralUtils.js
export const LEVEL_PERCENT = [0.30, 0.10, 0.05, 0.02, 0.01, 0.01, 0.01, 0.005, 0.005, 0.005];
// level 1 gets 30% etc — change as needed

export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// return array of arrays: level 1, level2, ...
export function buildLevels(rootId, depth = 10, allUsers = null) {
  const users = allUsers || getUsers();
  let result = [];
  let current = [rootId];

  for (let i = 1; i <= depth; i++) {
    const next = users.filter(u => current.includes(u.sponsor) || current.includes(u._id) || current.includes(u.id));
    result.push(next);
    current = next.map(u => u.id || u._id);
  }
  return result;
}

// pay referral commissions for a deposit amount: updates users' referralIncome and depositBalance (or credit)
export function payReferral(depositorId, amount) {
  const users = getUsers();
  const depositor = users.find(u => u.id === depositorId);
  if (!depositor) return { error: "depositor not found" };

  // walk up sponsor chain
  let curSponsorId = depositor.sponsor;
  for (let lvl = 0; lvl < LEVEL_PERCENT.length && curSponsorId; lvl++) {
    const sponsor = users.find(u => u.id === Number(curSponsorId));
    if (!sponsor) break;

    const percent = LEVEL_PERCENT[lvl] || 0;
    const reward = Number((amount * percent).toFixed(2));
    sponsor.referralIncome = (sponsor.referralIncome || 0) + reward;
    sponsor.depositBalance = (sponsor.depositBalance || 0) + reward; // add to balance

    // move up
    curSponsorId = sponsor.sponsor;
  }

  saveUsers(users);
  return { ok: true };
}

// activate user (set activationDate) and optionally mark as active
export function activateUser(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  user.activationDate = new Date().toISOString().slice(0, 10);
  saveUsers(users);
  return user;
}

// export array to csv string
export function toCSV(rows, columns) {
  const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = columns.map(c => esc(c.label)).join(",");
  const lines = rows.map(r => columns.map(c => esc(r[c.key])).join(","));
  return [header, ...lines].join("\n");
}
