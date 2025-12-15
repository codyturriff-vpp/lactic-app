let coverage = "";

// Google Sheets credentials
const SHEET_ID = "17BbaWlX0w1FdsuWLVP5ud212YiYLW4yTL7WuKQ4tXpU";
const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "lactic-app-481315",
  "private_key_id": "cff75d52e38d62aff89e2618989041655ea7d78b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDF4DmRZB9Kb68C\nPDSCLk3e4/AHxTLf84Ic7qCVHXZjqMF0J7NbjzpkBlmLXXavwfaGSjXfktnr3M5g\nggEdJCr0mU1OGoOZNOsl/WLY9MmqtCUyNypyfqCNQ/9IC6rNM22B0mxXYfs9kex9u\nLujRU51m9Fob5EynyvbXfkaPYTUjP6PqcmSLAvn/vg5W3x49h+7Jl+Ai6GLtdjw9\nwOkcKdY51qeMqxID2BgIaaqblSEeQ6hopVVaD01sPF2WbKMFhWeKPDB/4EBnt4a1\nHZFbrG9pLvbqyORjjcI2QI1SIOjYAJkmTryY9QAsr3JlQf38CriKjaKgn8eMLQFh\neqXt3CnFAgMBAAECggEAH86snPkMfplNTH1ZA267XbojegbyPUWWA13oZOUuLqmQ\neezCdqlN/YjNGWCWFNKHn4vg9RCqBFv4tf0TeGOdhsJGNDyQ80EhOrM2jXJulg9f\nRZDtdEyWwLfJORF5GOr6qkPI/dqvLmZhkFiXXBlQvUfyDsxioLuOH5L7d04XjelY\nfVA826+0nkQ8D032IxNqm0BD9TakuyrE5Nd6//z7OBZbC5JNFI4QmZffF6K2D6/t\nJMPfR/ddhYgfe/d4wVxm/pM9H6+Sc2pP58r5GLM+Vn/Q+oAYUwPmCYPosgi4RYXl\nt1L33AuFX6T81Qd8AIAvjdtM3VhljR75h0WshgEVUQKBgQDti+Kj/9iZaVSk/wC7\nWmj5Qxnskq+nJCFCalSfWFjJmtAclnR1DxMoM0V8BPShRuSFHKMrh7LwPMznqypM\n5l9Ea/RV5dqn2ISo3rwT19uvnYla7gEHOqZOmqElsY3IqwBQ7oqne2XZ2tYIB0Uk\nUKXomS0l4ORuJJjO0lDyhI5nwwKBgQDVP2gSrpDrP4Yoz8zjGuCtC10E1FzH7NsE\nZeYOB8tVZnKWtXnUStjV2vZJGrbY4rp9B+B/ZYbF6nI48C1Sswf+4u7CMox2LJWC\n92Rqy4r7HJjS2ctDHWV3PB9FI0c4EMq95p4H/BJWz9TmcjsI+auChQ5RL7YYPeYC\npf4YFsWX1wKBgEB7XnRiOOu7+ewoBIzXB/PR0TG0x9W5KwYaUwpGMyPW0HNSLB6y\njuK0uEHoHnfBBLtVgL2KQnqQJpckkYD6cBXksBi5Ile5oJkujSNdzxamzuhN/x11\nQDvKIcBXqEM2mAlgF2dLSeSPUNYxEwW+lqrDGcxUde2oJYrO8IZEkVt9AoGASLoS\nNWThucl1aM/N8ZpGC943QCFo7ypBW9OgzSItX5fL9sg3n4ZTQ0QlALOirn9M2L1p\n/CjU+QTHJdILswup62zbvtFchCUabIsQ7Tcz1AZhvG9Y2i/ZXfvcMkkgzec0LeXL\n+a8nVgIVeu50YdA8hQv54QhjkwrxOfAAo5iIlQsCgYAzQMxvRqoTY0hS+gn5Bi1l\nBXEDAtTGevp4OWTXYrGAwm5yrEnXhk8icGheArpXHUh8LA9H2ZMGpqs2WayBNXPV\nVxYTISuORpwLaAp/NUueJbCdd8dwahWm7qRR+6t33Z9fH9TU2cbLDpCj9cYkkUgT\nSsgjnlG41Gh4j8B4hvzlfA==\n-----END PRIVATE KEY-----\n",
  "client_email": "lactic-app-sync@lactic-app-481315.iam.gserviceaccount.com",
  "client_id": "116083221583174444073",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
};

function setCoverage(value) {
  coverage = value;
}

const params = new URLSearchParams(window.location.search);
const station = params.get("station") || "UNKNOWN";

document.getElementById("station").textContent = station;
document.getElementById("time").textContent = new Date().toLocaleString();

// Generate JWT token for Google API
async function getAccessToken() {
  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: SERVICE_ACCOUNT.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: SERVICE_ACCOUNT.token_uri,
    exp: now + 3600,
    iat: now
  };

  const headerEncoded = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const payloadEncoded = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;

  // Sign with private key
  const privateKey = SERVICE_ACCOUNT.private_key;
  const keyData = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');

  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signatureInput));
  const signatureEncoded = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const jwt = `${signatureInput}.${signatureEncoded}`;

  // Exchange JWT for access token
  const response = await fetch(SERVICE_ACCOUNT.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await response.json();
  return data.access_token;
}

// Add row to Google Sheets
async function addToGoogleSheets(entry) {
  try {
    const accessToken = await getAccessToken();
    
    const values = [[
      new Date(entry.timestamp).toLocaleDateString(),
      new Date(entry.timestamp).toLocaleTimeString(),
      entry.station,
      entry.house,
      entry.temp,
      entry.coverage,
      entry.drops
    ]];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${Lactic K2}/values/Sheet1!A:G:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      }
    );

    if (response.ok) {
      return true;
    } else {
      console.error('Google Sheets error:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Sync error:', error);
    return false;
  }
}

// Sync unsynced entries
async function syncEntries() {
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  const unsynced = entries.filter(e => !e.synced);

  if (unsynced.length === 0) {
    return;
  }

  for (const entry of unsynced) {
    const success = await addToGoogleSheets(entry);
    if (success) {
      entry.synced = true;
    }
  }

  localStorage.setItem("entries", JSON.stringify(entries));
}

function saveEntry() {
  if (!coverage) {
    alert("Please select PASS or FAIL for Carcass Coverage");
    return;
  }

  const entry = {
    id: crypto.randomUUID(),
    station,
    timestamp: new Date().toISOString(),
    house: document.getElementById("house").value,
    temp: document.getElementById("temp").value,
    coverage,
    drops: document.getElementById("drops").value,
    synced: false
  };

  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));

  alert("Entry saved locally ✓\nSyncing to Google Sheets...");

  // Try to sync if online
  if (navigator.onLine) {
    syncEntries();
  }

  // Clear form
  document.getElementById("house").value = "";
  document.getElementById("temp").value = "";
  document.getElementById("drops").value = "";
  coverage = "";
}

// Sync on page load
window.addEventListener('online', syncEntries);
window.addEventListener('load', syncEntries);

