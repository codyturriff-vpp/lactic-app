self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("lactic-cache").then(cache =>
      cache.addAll([
        "index.html",
        "app.js",
        "manifest.json"
      ])
    )
  );
});
