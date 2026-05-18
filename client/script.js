const API_URL = "https://ytt-5zcl.onrender.com/api/video";

async function fetchVideo() {

  const url = document.getElementById("youtubeUrl").value;

  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  loading.classList.remove("hidden");
  result.innerHTML = "";

  try {

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    loading.classList.add("hidden");

    if (data.error) {
      result.innerHTML = `
        <p>${data.error}</p>
      `;
      return;
    }

    let formatsHTML = "";

    data.formats.forEach(f => {

      formatsHTML += `
        <div class="format">

          <div>
            ${f.quality} • ${f.format} • ${f.fps || 30}fps
          </div>

          <a
            class="download-btn"
            href="${f.url}"
            target="_blank"
          >
            Download
          </a>

        </div>
      `;
    });

    result.innerHTML = `
      <div class="card">

        <img
          class="thumbnail"
          src="${data.thumbnail}"
        />

        <div class="content">

          <div class="title">
            ${data.title}
          </div>

          ${formatsHTML}

        </div>

      </div>
    `;

  } catch (err) {

    loading.classList.add("hidden");

    result.innerHTML = `
      <p>Something went wrong.</p>
    `;

    console.error(err);
  }
}
