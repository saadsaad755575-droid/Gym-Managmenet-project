 /*==========================================================
   storage.js  -  localStorage helper (shared by all pages)
   Kaam: sirf data padhna aur likhna. Payment logic yahan nahi.
   Load order: storage.js -> payment-service.js -> page ki file
   ========================================================== */

const STORAGE_KEYS = {
  // Aapke project ki purani keys (inhe hum same use karte hain)
  MEMBERS: "gymMembers",
  MEMBERSHIPS: "gymMemberships",
  PAYMENTS: "gymPayments",
  // Naye payment system ki keys (alag naam, taaki purani cheezein na tootein)
  PLANS: "payPlans",
  ACCOUNTS: "payAccounts",
  GYM_ACCOUNT: "payGymAccount",
  NOTIFICATIONS: "payNotifications",
  AUDIT_LOG: "payAuditLog",
};

/* ---------- Basic helpers ---------- */

function getData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error("storage read error:", key, error);
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("storage write error:", key, error);
    return false;
  }
}

function removeData(key) {
  localStorage.removeItem(key);
}

/* ---------- Unique ID (payment / transaction / token record) ---------- */

function generateId(prefix = "ID") {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${time}${random}`;
}

/* ---------- Seed data (pehli baar page khulne par) ---------- */

const SEED_DATA = {
  [STORAGE_KEYS.PLANS]: [
    { id: "P1", name: "Monthly", months: 1, price: 2500 },
    { id: "P2", name: "3 Months", months: 3, price: 6500 },
    { id: "P3", name: "6 Months", months: 6, price: 11000 },
    { id: "P4", name: "Yearly", months: 12, price: 20000 },
  ],
  [STORAGE_KEYS.MEMBERSHIPS]: [],
  [STORAGE_KEYS.ACCOUNTS]: [], // demo wallets, naya account number aane par ban jate hain
  [STORAGE_KEYS.PAYMENTS]: [],
  [STORAGE_KEYS.GYM_ACCOUNT]: { totalRevenue: 0 },
  [STORAGE_KEYS.NOTIFICATIONS]: [],
  [STORAGE_KEYS.AUDIT_LOG]: [],
};

// Sirf wahi key banegi jo pehle se maujood nahi (purana data safe rehta hai)
function initStorage() {
  Object.keys(SEED_DATA).forEach((key) => {
    if (localStorage.getItem(key) === null) {
      saveData(key, SEED_DATA[key]);
    }
  });
}

// "Reset Demo Data" button ke liye
// Sirf demo wallets, notifications, log aur plans reset hote hain.
// Aapke gymMemberships / gymPayments ko ye NAHI chhuta.
function resetDemoData() {
  [
    STORAGE_KEYS.PLANS,
    STORAGE_KEYS.ACCOUNTS,
    STORAGE_KEYS.GYM_ACCOUNT,
    STORAGE_KEYS.NOTIFICATIONS,
    STORAGE_KEYS.AUDIT_LOG,
  ].forEach((key) => saveData(key, SEED_DATA[key]));
}

/* ---------- Audit log (kisne, kab, kya hua) ---------- */

function addAuditLog(action, details = {}) {
  const logs = getData(STORAGE_KEYS.AUDIT_LOG);
  logs.push({
    id: generateId("LOG"),
    action,
    details,
    time: new Date().toISOString(),
  });
  saveData(STORAGE_KEYS.AUDIT_LOG, logs);
}

/* ---------- Notifications ---------- */

// forRole: "member" ya "admin", memberId: kis member ke liye (admin ke liye null)
function addNotification(forRole, memberId, message) {
  const list = getData(STORAGE_KEYS.NOTIFICATIONS);
  list.push({
    id: generateId("NTF"),
    forRole,
    memberId,
    message,
    read: false,
    time: new Date().toISOString(),
  });
  saveData(STORAGE_KEYS.NOTIFICATIONS, list);
}

/* ---------- Live refresh (dusre tab mein data badle to) ---------- */

function onStorageChange(callback) {
  window.addEventListener("storage", (event) => {
    if (Object.values(STORAGE_KEYS).includes(event.key)) {
      callback(event.key);
    }
  });
}

initStorage();

 
