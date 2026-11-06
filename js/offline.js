/* Registers the service worker so the app keeps working offline.
   Requires http:// or https:// — browsers do not allow workers on file://. */
(function () {
  "use strict";

  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "http:" && location.protocol !== "https:") return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function (error) {
      console.warn("Service worker registration failed:", error);
    });
  });
})();
