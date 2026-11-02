const API_URL = "/api/shortUrls";

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("user_with_data")) return;

  fetchShortLinks();
});

let shortUrlsMemo = [];

document.getElementById("form-cutty").addEventListener("submit", async (e) => {
  e.preventDefault();

  const urlInput = document.getElementById("url-input");
  const urlAlias = document.getElementById("url-alias");
  const btn = document.getElementById("btn-submit");
  const btnLabel = btn.querySelector("span");

  btn.disabled = true;
  btnLabel.textContent = "Shortening…";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify({
        original_url: urlInput.value,
        alias: urlAlias.value,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const newResource = await response.json();
    localStorage.setItem("user_with_data", "true");

    shortUrlsMemo.push(newResource.dataToRespond);
    showLinks(shortUrlsMemo);

    urlInput.value = "";
    urlAlias.value = "";

    iziToast.success({
      title: "Link shortened",
      message: "Your new link is ready to share.",
      position: "topRight",
      progressBar: false,
      timeout: 3000,
    });
  } catch (error) {
    iziToast.warning({
      title: `${error}`,
      color: "red",
      position: "topRight",
      progressBar: false,
    });
  }

  btn.disabled = false;
  btnLabel.textContent = "Shorten link";
});

async function fetchShortLinks() {
  showLoader();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(API_URL, {
      credentials: "include",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Could not load your links (${response.status})`);
    }

    const data = await response.json();

    shortUrlsMemo = data;
    showLinks(data);
  } catch (error) {
    console.error(error);
  } finally {
    clearTimeout(timeoutId);
    closeLoader();
  }
}

async function copyText(id, button) {
  const text = document.getElementById(`url-${id}`).textContent;

  try {
    await navigator.clipboard.writeText(text.trim());

    if (button) {
      const original = button.innerHTML;
      button.classList.add("is-copied");
      button.innerHTML = `<svg class="icons" aria-hidden="true"><use xlink:href="#icon-check"></use></svg> Copied`;

      setTimeout(() => {
        button.classList.remove("is-copied");
        button.innerHTML = original;
      }, 1600);
    }

    iziToast.success({
      title: "Copied to clipboard",
      color: "blue",
      position: "topRight",
      progressBar: false,
      timeout: 2500,
    });
  } catch (err) {
    console.error("Error copying text: ", err);
  }
}

function openLink(id) {
  const link = document.getElementById(`url-${id}`).textContent;
  window.open(link.trim(), "_blank", "noopener,noreferrer");
}

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function closeLoader() {
  document.getElementById("loader").style.display = "none";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showLinks(data) {
  const container = document.getElementById("url-container");
  const showResults = document.getElementById("show-results");
  const counter = document.getElementById("links-count");

  showResults.style.display = "block";

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `
      <li class="empty-state">
        <span class="empty-icon">
          <svg class="icons" aria-hidden="true"><use xlink:href="#icon-links"></use></svg>
        </span>
        <h3>No links yet</h3>
        <p>Shorten your first URL and it will show up here.</p>
      </li>
    `;
    if (counter) counter.textContent = "0 links";
    return;
  }

  const links = [...data].reverse();

  if (counter) {
    counter.textContent = `${links.length} ${links.length === 1 ? "link" : "links"}`;
  }

  container.innerHTML = links
    .map((x, i) => {
      return `
      <li style="animation-delay: ${Math.min(i * 40, 240)}ms">
        <div class="urls-container-flex">
          <i class="iLink">
            <svg class="icons" aria-hidden="true">
              <use xlink:href="#icon-links"></use>
            </svg>
          </i>
          <div class="urls-div">
            <a id="url-${i}" target="_blank" rel="noopener noreferrer" href="${escapeHtml(x.tiny_url)}">
              ${escapeHtml(x.tiny_url)}
            </a>
            <p title="${escapeHtml(x.original_url)}">${escapeHtml(x.original_url)}</p>
          </div>
        </div>
        <div class="buttons-container">
          <button id="copy-button-${i}" class="copy-button" type="button">
            <svg class="icons" aria-hidden="true">
              <use xlink:href="#icon-copy"></use>
            </svg>
            Copy
          </button>
          <button class="visit-button" type="button">
            <svg class="icons" aria-hidden="true">
              <use xlink:href="#icon-external"></use>
            </svg>
            Visit
          </button>
        </div>
      </li>
      `;
    })
    .join("");

  document.querySelectorAll(".copy-button").forEach((button, index) => {
    button.addEventListener("click", () => copyText(index, button));
  });

  document.querySelectorAll(".visit-button").forEach((button, index) => {
    button.addEventListener("click", () => openLink(index));
  });
}
