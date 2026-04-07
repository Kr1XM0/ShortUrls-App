document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("user_with_data")) {
  } else {
    fetchShortLinks();
  }
});

let shortUrlsMemo = [];

document.getElementById("form-cutty").addEventListener("submit", async (e) => {
  e.preventDefault();

  const urlInput = document.getElementById("url-input");
  const urlAlias = document.getElementById("url-alias");
  const btn = document.getElementById("btn-submit");

  btn.disabled = true;
  btn.textContent = "Creando...";

  try {
    const response = await fetch("https://kut.fly.dev/api/shortUrls", {
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
  } catch (error) {
    iziToast.warning({
      title: `${error}`,
      color: "red",
      position: "topRight",
      progressBar: false,
    });
  }

  btn.disabled = false;
  btn.textContent = "Acortar URL";

  return false;
});

async function fetchShortLinks() {
  showLoader();
  try {
    const response = await fetch("https://kut.fly.dev/api/shortUrls", {
      credentials: "include",
    });

    if (!response.ok) return;
    const data = await response.json();

    shortUrlsMemo = data;
    showLinks(data);
    closeLoader();
  } catch (error) {
    console.error(error);
  }
  closeLoader();
}

async function copyText(id) {
  const text = document.getElementById(`url-${id}`).textContent;

  try {
    await navigator.clipboard.writeText(text.trim());
    iziToast.success({
      title: "Copied successfully",
      color: "blue",
      position: "topRight",
      progressBar: false,
    });
  } catch (err) {
    console.error("Error al copiar el texto: ", err);
  }
}

function openLink(id) {
  const link = document.getElementById(`url-${id}`).textContent;
  window.open(link, "_blank");
}

function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function closeLoader() {
  document.getElementById("loader").style.display = "none";
}

function showLinks(data) {
  const container = document.getElementById("url-container");
  const showResults = document.getElementById("show-results");

  if (data.length === 0) {
    showResults.style.display = "none";
    container.innerHTML = "<p>No hay URLs acortadas aún.</p>";
    return;
  }

  data.reverse();

  showResults.style.display = "block";

  container.innerHTML = data
    .map((x, i) => {
      return `
      <li>
        <div class="urls-container-flex">
          <i class="iLink">
            <svg class="icons" >
              <use xlink:href="#icon-links"></use>
            </svg>
          </i>
          <div class="urls-div">
            <a id="url-${i}" target="_blank" rel="noopener noreferrer" href="${x.tiny_url}"> 
            ${x.tiny_url}
            </a>
            <p>${x.original_url}</p>
          </div>
        </div>
        <div class="buttons-container">
          <button id=copy-button-${i} class="copy-button">
            <svg class="icons">
              <use xlink:href="#icon-copy"></use>
            </svg>
          Copy
          </button>
          <button class="visit-button">
            <svg class="icons">
              <use xlink:href="#icon-external"></use>
            </svg>
              Visit
          </button>
        </div>
      </li>
      <hr>
      `;
    })
    .join("");

  document.querySelectorAll(".copy-button").forEach((button, index) => {
    button.addEventListener("click", () => copyText(index));
  });

  document.querySelectorAll(".visit-button").forEach((button, index) => {
    button.addEventListener("click", () => openLink(index));
  });
}

function notifica() {
  iziToast.show({
    title: "¡Hola!",
    message: "Esta es una notificación con Izitoast.",
    position: "topRight",
  });
}
