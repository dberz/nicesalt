// GA4 event layer for NiceSalt — declarative, one delegated listener.
//
// gtag itself is loaded in BaseLayout (SITE.ga4Id). This file turns
// data-analytics-* attributes into a consistent event taxonomy
// (navigation / recirculation / outbound_click / select_content) and fires the
// inquiry lead events on the /thanks/ confirmation page.
//
// Container attributes (nearest ancestor or the element itself wins):
//   data-analytics-component="header_nav"   -> component_name dimension
//   data-analytics-event="navigation"        -> navigation | recirculation | cta
// External links always fire outbound_click, annotated or not.
(function () {
  "use strict";

  var MAX_TEXT = 100;

  function trackEvent(name, params) {
    params = params || {};
    var clean = {};
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) {
        var v = params[k];
        if (v !== "" && v != null) clean[k] = v;
      }
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", name, clean);
    } else {
      window.dataLayer = window.dataLayer || [];
      var payload = { event: name };
      for (var p in clean) if (Object.prototype.hasOwnProperty.call(clean, p)) payload[p] = clean[p];
      window.dataLayer.push(payload);
    }
  }
  window.trackEvent = trackEvent;

  function siteHost() {
    return location.hostname.replace(/^www\./, "");
  }
  function linkText(el) {
    var label = el.getAttribute("aria-label") || el.textContent || "";
    return label.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT);
  }
  function hostname(url) {
    try {
      return new URL(url, location.href).hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  }
  function isExternal(href) {
    if (!/^https?:\/\//i.test(href)) return false;
    var h = hostname(href);
    return Boolean(h) && h !== siteHost();
  }
  function leadSource() {
    try {
      var utm = new URLSearchParams(location.search).get("utm_source");
      if (utm) return utm;
    } catch (e) {}
    if (document.referrer) {
      var rh = hostname(document.referrer);
      if (rh && rh !== siteHost()) return rh;
    }
    return "direct";
  }

  function onClick(event) {
    var start = event.target;
    var el = start && start.closest ? start.closest("a, button") : null;
    if (!el) return;

    var href = el.getAttribute("href") || "";
    var componentEl = el.closest("[data-analytics-component]");
    var component = (componentEl && componentEl.getAttribute("data-analytics-component")) || "unattributed";
    var explicit =
      el.getAttribute("data-analytics-event") ||
      (componentEl && componentEl.getAttribute("data-analytics-event")) ||
      "";
    var text = linkText(el);

    // 1) Outbound / affiliate — any external link, annotated or not.
    if (el.tagName === "A" && isExternal(href)) {
      trackEvent("outbound_click", {
        component_name: component,
        link_text: text,
        link_url: href,
        link_domain: hostname(href)
      });
      return;
    }

    // 2) CTA / button.
    if (explicit === "cta" || explicit === "select_content") {
      trackEvent("select_content", {
        content_type: "cta",
        component_name: component,
        link_text: text,
        link_url: href
      });
      return;
    }

    // 3) Recirculation — content-to-content internal links.
    if (explicit === "recirculation" && href) {
      trackEvent("recirculation", { component_name: component, link_text: text, link_url: href });
      return;
    }

    // 4) Navigation — site chrome.
    if (explicit === "navigation" && href) {
      trackEvent("navigation", { component_name: component, link_text: text, link_url: href });
      return;
    }
    // Un-annotated internal links stay untracked; page_view covers destinations.
  }

  // Capture phase: record clicks even when another handler cancels default.
  document.addEventListener("click", onClick, { capture: true });

  // ---- Inquiry lead events ----------------------------------------------------
  // The contact form POSTs to an external handler and redirects to /thanks/, so
  // "success" is the thanks page loading. We stash context on submit and fire the
  // lead events once we land on /thanks/.
  var LEAD_KEY = "ns_lead";

  function initLeads() {
    var form = document.querySelector("[data-inquiry-form]");
    if (form) {
      form.addEventListener("submit", function () {
        var sel = form.querySelector("[name='project_type']");
        try {
          sessionStorage.setItem(
            LEAD_KEY,
            JSON.stringify({
              form_name: form.getAttribute("data-form-name") || "contact",
              inquiry_type: (sel && sel.value) || "",
              source_page: location.pathname,
              lead_source: leadSource()
            })
          );
        } catch (e) {}
      });
    }

    if (location.pathname.indexOf("/thanks") === 0) {
      var raw = null;
      try {
        raw = sessionStorage.getItem(LEAD_KEY);
      } catch (e) {}
      if (!raw) return;
      var ctx = {};
      try {
        ctx = JSON.parse(raw);
      } catch (e) {}
      var formName = ctx.form_name || "contact";
      // Standard event (feeds GA4's Generate-leads report) + named companion.
      trackEvent("generate_lead", {
        method: "inquiry",
        form_name: formName,
        value: 10,
        currency: "USD",
        lead_source: ctx.lead_source,
        inquiry_type: ctx.inquiry_type,
        source_page: ctx.source_page
      });
      trackEvent("inquiry_submit", {
        form_name: formName,
        inquiry_type: ctx.inquiry_type,
        lead_source: ctx.lead_source,
        source_page: ctx.source_page
      });
      try {
        sessionStorage.removeItem(LEAD_KEY);
      } catch (e) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLeads);
  } else {
    initLeads();
  }
})();
