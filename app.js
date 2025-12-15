let coverage = "";

// Google Apps Script deployment URL
const SCRIPT_URL = "https://script.googleapis.com/macros/s/AKfycbzhS7IVPUXJcXfz_2AF3GxmoIDnnNW6ZmQ4tUUzrzZvQ0TS8-6DkcAAdc9LOH78Zjai/exec";

function setCoverage(value) {
  coverage = value;
}

const params = new URLSearchParams(window.location.search);
const station = params.get("station") || "UNKNOWN";

document.getElementById("station").textContent = station;
document.getElementById("time").textContent = new Date().toLocaleString();

// Add row to Google Sheets via Apps Script
async function addToGoogleSheets(entry) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        date: new Date(entry.timestamp).toLocaleDateString(),
        time: new Date(entry.timestamp).toLocaleTimeString(),
        station: entry.station,
        house: entry.house,
        temp: entry.temp,
        coverage: entry.coverage,
        drops: entry.drops
      })
    });

    if (response.ok) {
      const result = await response.json();
      return result.success;
    } else {
      console.error('Script error:', response.status);
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
      console.log('Entry synced:', entry.id);
    } else {
      console.log('Failed to sync:', entry.id);
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

// Sync on page load and when coming online
window.addEventListener('online', syncEntries);
window.addEventListener('load', syncEntries);
