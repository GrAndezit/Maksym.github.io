const borderOption = document.getElementById("borderOption");
const imageOption = document.getElementById("imageOption");
const layoutOption = document.getElementById("layoutOption");
const fontOption = document.getElementById("fontOption");
const colorOption = document.getElementById("colorOption");
const postcardText = document.getElementById("postcardText");
const confettiToggle = document.getElementById("confettiToggle");

const postcard = document.getElementById("postcard");
const confettiLayer = document.getElementById("confettiLayer");

const layouts = {
  layout1: document.getElementById("layout1"),
  layout2: document.getElementById("layout2"),
  layout3: document.getElementById("layout3")
};

const images = {
  layout1: document.getElementById("postcardImage"),
  layout2: document.getElementById("postcardImage2"),
  layout3: document.getElementById("postcardImage3")
};

const messages = {
  layout1: document.getElementById("postcardMessage"),
  layout2: document.getElementById("postcardMessage2"),
  layout3: document.getElementById("postcardMessage3")
};

function updateBorders() {
  const val = borderOption.value;
  const t = document.querySelector(".border-top");
  const b = document.querySelector(".border-bottom");
  const l = document.querySelector(".border-left");
  const r = document.querySelector(".border-right");

  t.style.display = b.style.display = l.style.display = r.style.display = "none";

  if (val === "all") {
    t.style.display = b.style.display = l.style.display = r.style.display = "block";
  } else if (val === "topbottom") {
    t.style.display = b.style.display = "block";
  } else if (val === "leftright") {
    l.style.display = r.style.display = "block";
  }
}

borderOption.addEventListener("change", updateBorders);
updateBorders();

imageOption.addEventListener("change", () => {
  const src = "images/" + imageOption.value;
  Object.values(images).forEach(img => {
    img.src = src;
  });
});

function updateLayout() {
  Object.values(layouts).forEach(l => (l.style.display = "none"));
  layouts[layoutOption.value].style.display = "block";
}

layoutOption.addEventListener("change", updateLayout);
updateLayout();

fontOption.addEventListener("change", () => {
  Object.values(messages).forEach(m => {
    m.style.fontFamily = fontOption.value;
  });
});

colorOption.addEventListener("change", () => {
  Object.values(messages).forEach(m => {
    m.style.color = colorOption.value;
  });
});

postcardText.addEventListener("input", () => {
  const text = postcardText.value || "Merry Christmas!";
  Object.values(messages).forEach(m => (m.textContent = text));
});

function updateConfetti() {
  const show = confettiToggle.checked;
  confettiLayer.style.display = show ? "block" : "none";
  confettiLayer.classList.toggle("show", show);
}

confettiToggle.addEventListener("change", updateConfetti);
updateConfetti();

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const canvas = await html2canvas(postcard, { useCORS: true });
  const link = document.createElement("a");
  link.download = "postcard.png";
  link.href = canvas.toDataURL();
  link.click();
});
