let coverage = "";

function setCoverage(value) {
  coverage = value;
}

const params = new URLSearchParams(window.location.search);
const station = params.get("station") || "UNKNOWN";

document.getElementById("station").textContent = station;
document.getElementById("time").textContent = new Date().toLocaleString();

function saveEntry() {
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

  alert("Entry saved locally (offline hard copy).");
}
