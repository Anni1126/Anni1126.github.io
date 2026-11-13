/* Meta-Pixel mit Einwilligung · andrea.nielbock.de
   Einbinden im <head> jeder Seite:  <script src="/meta-pixel.js" defer></script>
   - Lädt den Pixel erst nach "Okay" im Cookie-Hinweis.
   - Jede Seite: PageView.
   - .../fast-geschafft.html : Lead (einmal pro Browser)
   - .../willkommen.html     : CompleteRegistration (einmal pro Browser)
*/
(function () {
  var PIXEL_ID = "294697577843921";
  var DATENSCHUTZ = "https://andrea.nielbock.de/datenschutz.html";
  var KEY = "mp-consent";
  var path = location.pathname;
  var EVENT = /fast-geschafft(\.html|\/)?$/.test(path) ? "Lead"
            : /willkommen(\.html|\/)?$/.test(path) ? "CompleteRegistration" : "";

  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  function del(k){ try { localStorage.removeItem(k); } catch(e){} }

  function startPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
    if (EVENT) {
      var once = "mp-sent-" + EVENT + "-" + path;
      if (!get(once)) {
        fbq("track", EVENT, {}, { eventID: EVENT.toLowerCase() + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) });
        set(once, "1");
      }
    }
  }

  var CSS = ".mp-banner{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:620px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;background:rgba(255,253,247,.97);color:#23302a;border:1px solid #e1d5b9;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.15);padding:9px 12px;font:13px/1.4 Figtree,system-ui,-apple-system,'Segoe UI',sans-serif}" +
    ".mp-banner p{margin:0;flex:1 1 260px}.mp-banner a{color:inherit}" +
    ".mp-row{display:flex;gap:8px}.mp-row button{width:92px;padding:6px 0;border-radius:999px;border:1px solid #23302a;background:transparent;color:#23302a;font:600 13px Figtree,system-ui,sans-serif;cursor:pointer}" +
    ".mp-settings{display:block;text-align:center;font:12px Figtree,system-ui,sans-serif;padding:10px 0 14px;opacity:.7}.mp-settings a{color:inherit}";

  function closeBanner(){ var b = document.getElementById("mp-banner"); if (b) b.remove(); }
  function showBanner() {
    if (document.getElementById("mp-banner")) return;
    var d = document.createElement("div");
    d.id = "mp-banner"; d.className = "mp-banner"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Cookie-Einstellungen");
    d.innerHTML = '<p>Darf ich mit dem Meta-Pixel messen, ob meine Anzeigen ankommen? Dabei gehen Daten an Meta. <a href="' + DATENSCHUTZ + '">Mehr dazu</a></p>' +
      '<div class="mp-row"><button type="button" class="mp-no">Ablehnen</button><button type="button" class="mp-yes">Okay</button></div>';
    d.querySelector(".mp-yes").onclick = function(){ set(KEY, "yes"); closeBanner(); startPixel(); };
    d.querySelector(".mp-no").onclick  = function(){ set(KEY, "no");  closeBanner(); };
    document.body.appendChild(d);
  }
  window.mpCookieSettings = function(){ del(KEY); location.reload(); };

  function init(){
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var l = document.createElement("div"); l.className = "mp-settings";
    l.innerHTML = '<a href="#" onclick="mpCookieSettings();return false">Cookie-Einstellungen</a>';
    document.body.appendChild(l);
    var c = get(KEY); if (c === "yes") startPixel(); else if (c !== "no") showBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
