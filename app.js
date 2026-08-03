sizePopupToScreen(0.4, 0.7);

const clip = document.getElementById("clip");
const clipsContainer = document.getElementById("clips");
const emptyState = document.getElementById("empty-state");
const save = document.getElementById("save-clip");
const clear = document.getElementById("clear-clip");
const deleteAll = document.getElementById("delete-all");
const saveTab = document.getElementById("save-tab");
const toast = document.getElementById("toast");

let myClips = [];
let toastTimer = null;

const clipsFromLocalStorage = JSON.parse(localStorage.getItem("myClips"));
if (clipsFromLocalStorage) {
  myClips = clipsFromLocalStorage;
}

render(myClips);

function sizePopupToScreen(widthFraction, heightFraction) {
  // Chrome caps extension popups at 800×600.
  const maxWidth = 800;
  const maxHeight = 600;
  const minWidth = 380;
  const minHeight = 320;

  const width = Math.round(
    Math.min(maxWidth, Math.max(minWidth, screen.availWidth * widthFraction))
  );
  const height = Math.round(
    Math.min(
      maxHeight,
      Math.max(minHeight, screen.availHeight * heightFraction)
    )
  );

  document.documentElement.style.width = `${width}px`;
  document.documentElement.style.height = `${height}px`;
  document.body.style.width = `${width}px`;
  document.body.style.height = `${height}px`;
}

save.addEventListener("click", function () {
  if (clip.value.trim() === "") return;

  myClips.push(clip.value);
  clip.value = "";
  persist();
  render(myClips);
});

clear.addEventListener("click", function () {
  clip.value = "";
  clip.focus();
});

deleteAll.addEventListener("dblclick", function () {
  localStorage.clear();
  myClips = [];
  render(myClips);
});

saveTab.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myClips.push(tabs[0].url);
    persist();
    render(myClips);
  });
});

function persist() {
  localStorage.setItem("myClips", JSON.stringify(myClips));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 1100);
}

function confirmCopy(itemEl, copyBtn) {
  if (itemEl) {
    itemEl.classList.remove("is-copied");
    void itemEl.offsetWidth;
    itemEl.classList.add("is-copied");
    setTimeout(function () {
      itemEl.classList.remove("is-copied");
    }, 520);
  }

  if (copyBtn) {
    const original = copyBtn.textContent;
    copyBtn.classList.add("is-success");
    copyBtn.textContent = "Copied";
    setTimeout(function () {
      copyBtn.classList.remove("is-success");
      copyBtn.textContent = original;
    }, 900);
  }

  showToast("Copied to clipboard");
}

async function copyText(text, itemEl, copyBtn) {
  try {
    await navigator.clipboard.writeText(text);
    confirmCopy(itemEl, copyBtn);
  } catch (error) {
    showToast("Copy failed");
  }
}

function render(clips) {
  emptyState.hidden = clips.length > 0;

  if (clips.length === 0) {
    clipsContainer.innerHTML = "";
    return;
  }

  let listItems = "";
  for (let i = 0; i < clips.length; i++) {
    listItems += `
      <li class="clip_target_wrapper" data-index="${i}" style="animation-delay: ${i * 40}ms">
        <div class="copy-btn-wrapper">
          <button class="copy-btn" type="button" data-index="${i}">Copy</button>
        </div>
        <div class="clip-text-wrap">
          <p class="cliptarget">${escapeHtml(clips[i])}</p>
        </div>
        <div class="del_btn_wrapper">
          <button class="del-btn" type="button" data-index="${i}">Delete</button>
        </div>
      </li>
    `;
  }

  clipsContainer.innerHTML = listItems;

  const items = clipsContainer.querySelectorAll(".clip_target_wrapper");
  items.forEach(function (item) {
    const index = Number(item.dataset.index);
    const copyBtn = item.querySelector(".copy-btn");
    const deleteBtn = item.querySelector(".del-btn");

    item.addEventListener("click", function (event) {
      if (event.target.closest("button")) return;
      copyText(clips[index], item, copyBtn);
    });

    copyBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      copyText(clips[index], item, copyBtn);
    });

    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      item.classList.add("is-removing");
      setTimeout(function () {
        myClips.splice(index, 1);
        persist();
        render(myClips);
      }, 220);
    });
  });
}
