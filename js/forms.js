(function () {
  "use strict";

  var endpoint = "https://api.web3forms.com/submit";
  var config = window.SITE_CONFIG || {};
  var accessKey = config.web3formsAccessKey || "53fc0ae6-0d06-44bd-a2fd-a49eabab4168";

  document.querySelectorAll('input[name="access_key"]').forEach(function (input) {
    input.value = accessKey;
  });

  document.querySelectorAll("form.js-form").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var submit = form.querySelector('[type="submit"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && (honeypot.checked || honeypot.value)) {
        showStatus(status, "Thanks — your message has been sent.", "success");
        form.reset();
        return;
      }

      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }

      var payload = new FormData(form);
      payload.set("access_key", accessKey);
      payload.delete("redirect");

      var originalLabel = submit ? submit.textContent : "";
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }
      showStatus(status, "Sending…", "pending");

      fetch(endpoint, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.data && result.data.success) {
            form.reset();
            showStatus(status, "Thanks — your message has been sent. I’ll reply as soon as I can.", "success");
          } else {
            var message =
              (result.data && result.data.message) ||
              "Something went wrong. Please try again in a moment.";
            showStatus(status, message, "error");
          }
        })
        .catch(function () {
          showStatus(
            status,
            "Network error. Check your connection and try again, or retry in a moment.",
            "error"
          );
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = originalLabel;
          }
        });
    });
  });

  function showStatus(el, message, type) {
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
    el.className = "form-status is-" + type;
    el.setAttribute("role", type === "error" ? "alert" : "status");
  }

  function openRequestCvFromHash() {
    var details = document.getElementById("request-cv");
    if (!details) return;
    if (location.hash === "#request-cv") {
      details.open = true;
    }
  }

  openRequestCvFromHash();
  window.addEventListener("hashchange", openRequestCvFromHash);
  document.querySelectorAll('a[href="#request-cv"], a[href$="#request-cv"]').forEach(function (link) {
    link.addEventListener("click", function () {
      var details = document.getElementById("request-cv");
      if (details) details.open = true;
    });
  });
})();
