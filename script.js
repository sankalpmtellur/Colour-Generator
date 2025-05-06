let colors = [];

function generateHexColor() {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, '0')}`;
}

function generatePalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";

  colors = colors.map((colorObj) => {
    return colorObj.locked ? colorObj : { color: generateHexColor(), locked: false };
  });

  if (colors.length === 0) {
    for (let i = 0; i < 5; i++) {
      colors.push({ color: generateHexColor(), locked: false });
    }
  }

  colors.forEach((colorObj, index) => {
    const box = document.createElement("div");
    box.className = "color-box";
    box.style.backgroundColor = colorObj.color;

    const colorCode = document.createElement("div");
    colorCode.className = "color-code";
    colorCode.innerText = colorObj.color;
    colorCode.onclick = () => copyToClipboard(colorObj.color);

    const lock = document.createElement("div");
    lock.className = "lock-toggle";
    lock.innerText = colorObj.locked ? "🔒" : "🔓";
    lock.onclick = () => toggleLock(index);

    box.appendChild(lock);
    box.appendChild(colorCode);
    palette.appendChild(box);
  });
}

function toggleLock(index) {
  colors[index].locked = !colors[index].locked;
  generatePalette();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`Copied: ${text}`);
  });
}

function savePalette() {
  const saved = JSON.parse(localStorage.getItem("palettes") || "[]");
  saved.push(colors.map(c => c.color));
  localStorage.setItem("palettes", JSON.stringify(saved));
  displaySavedPalettes();
}

function deletePalette(index) {
  const saved = JSON.parse(localStorage.getItem("palettes") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("palettes", JSON.stringify(saved));
  displaySavedPalettes();
}

function displaySavedPalettes() {
  const savedContainer = document.getElementById("saved-palettes");
  savedContainer.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("palettes") || "[]");

  saved.forEach((palette, index) => {
    const paletteWrapper = document.createElement("div");
    paletteWrapper.className = "palette-preview-wrapper";

    const preview = document.createElement("div");
    preview.className = "palette-preview";
    palette.forEach(color => {
      const colorDiv = document.createElement("div");
      colorDiv.className = "color-preview";
      colorDiv.style.backgroundColor = color;
      preview.appendChild(colorDiv);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗑️ Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deletePalette(index);

    paletteWrapper.appendChild(preview);
    paletteWrapper.appendChild(deleteBtn);
    savedContainer.appendChild(paletteWrapper);
  });
}

generatePalette();
displaySavedPalettes();