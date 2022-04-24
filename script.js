"use strict";

(function () {
  const text = document.querySelector(".codetext");
  const btn = document.querySelector(".btn");

  const code = window.location.href.split("code=")[1]

  if (code.includes("error")) return (text.textContent = "Error");

  text.innerHTML = code;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      btn.textContent = "Copied";
    } catch (e) {
      btn.textContent = "Error";
      alert("Error. Copy text manually.");
    }
    setTimeout(() => {
      btn.textContent = "Copy to clipboard";
    }, 1000);
  });
})();
