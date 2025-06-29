const originalInput = document.getElementById("original-image");
const secretInput = document.getElementById("secret-image");
const embedStego = document.getElementById("embed-stego");
const extractedMessage = document.getElementById("extracted-message");
const downloadStego = document.getElementById("download-stego");
const imageSize = document.getElementById("image-size");
const messageTextarea = document.getElementById("message");

const embedSection = document.getElementById("embed-section");
const extractSection = document.getElementById("extract-section");

function resetEmbedForm() {
  originalInput.value = "";
  messageTextarea.value = "";
  embedStego.src = "";
  downloadStego.style.display = "none";
  imageSize.textContent = "-";
}

function resetExtractForm() {
  secretInput.value = "";
  extractedMessage.innerText = "";
}

function showEmbed() {
  localStorage.setItem("currentMode", "embed");

  // Animation when switching to embed mode
  extractSection.style.opacity = "0";
  extractSection.style.transform = "translateX(20px)";
  extractSection.classList.add("hidden");

  embedSection.classList.remove("hidden");
  embedSection.style.opacity = "0";
  embedSection.style.transform = "translateX(-20px)";

  setTimeout(() => {
    embedSection.style.transition = "all 0.3s ease-out";
    embedSection.style.opacity = "1";
    embedSection.style.transform = "translateX(0)";
  }, 50);

  resetExtractForm();
}

function showExtract() {
  localStorage.setItem("currentMode", "extract");

  // Animation when switching to extract mode
  embedSection.style.opacity = "0";
  embedSection.style.transform = "translateX(-20px)";
  embedSection.classList.add("hidden");

  extractSection.classList.remove("hidden");
  extractSection.style.opacity = "0";
  extractSection.style.transform = "translateX(20px)";

  setTimeout(() => {
    extractSection.style.transition = "all 0.3s ease-out";
    extractSection.style.opacity = "1";
    extractSection.style.transform = "translateX(0)";
  }, 50);

  resetEmbedForm();
}

window.addEventListener("DOMContentLoaded", () => {
  const currentMode = localStorage.getItem("currentMode") || "embed";
  if (currentMode === "embed") {
    showEmbed();
  } else {
    showExtract();
  }
});

originalInput.addEventListener("change", () => {
  const file = originalInput.files[0];
  if (file) {
    embedStego.src = "";
    downloadStego.style.display = "none";

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    imageSize.textContent = `${sizeMB} MB`;
  } else {
    imageSize.textContent = "-";
  }
});

secretInput.addEventListener("change", () => {
  const file = secretInput.files[0];
  if (file) {
    extractedMessage.innerText = "";
  }
});

function embedMessage() {
  const file = originalInput.files[0];
  const message = messageTextarea.value;

  if (!file || !message) {
    Swal.fire({
      title: "Peringatan!",
      text: "Harap upload gambar dan isi pesan terlebih dahulu.",
      icon: "warning",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Mengerti",
    });
    return;
  }

  Swal.fire({
    title: "Memproses...",
    text: "Sedang menyisipkan pesan ke dalam gambar",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const formData = new FormData();
  formData.append("image", file);
  formData.append("message", message);

  fetch("/embed", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal menyisipkan pesan");
      }
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      embedStego.src = url;
      downloadStego.href = url;
      downloadStego.style.display = "inline-block";
      updateEmbedStegoPreview(url); // Update preview
      Swal.fire({
        title: "Berhasil!",
        text: "Pesan berhasil disisipkan ke dalam gambar!",
        icon: "success",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Baik",
      });
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat proses embed.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Mengerti",
      });
    });
}

function extractMessage() {
  const file = secretInput.files[0];

  if (!file) {
    Swal.fire({
      title: "Peringatan!",
      text: "Harap upload gambar terlebih dahulu.",
      icon: "warning",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Mengerti",
    });
    return;
  }

  Swal.fire({
    title: "Memproses...",
    text: "Sedang mengekstrak pesan dari gambar",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const formData = new FormData();
  formData.append("image", file);

  fetch("/extract", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal mengekstrak pesan");
      }
      return res.json();
    })
    .then((data) => {
      if (data.message) {
        extractedMessage.innerText = data.message;
        Swal.fire({
          title: "Berhasil!",
          text: "Pesan berhasil diekstrak dari gambar!",
          icon: "success",
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Baik",
        });
      } else {
        extractedMessage.innerText = "";
        Swal.fire({
          title: "Peringatan",
          text: "Tidak ditemukan pesan dalam gambar.",
          icon: "warning",
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Mengerti",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengekstrak pesan.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Mengerti",
      });
    });
}

function showImagePreview(dropArea, fileInput, previewId) {
  const file = fileInput.files[0];
  if (!file) return;

  // Hapus isi drop area
  dropArea.innerHTML = "";

  // Buat elemen img preview
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.alt = "Pratinjau Gambar";
  img.className = "img-preview-upload";
  img.id = previewId;

  // Tampilkan ukuran file
  const sizeInfo = document.createElement("div");
  sizeInfo.className = "file-size-info";
  sizeInfo.textContent = `Ukuran file: ${(file.size / 1024).toFixed(2)} KB`;

  // Tombol pilih ulang
  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.textContent = "Pilih Ulang";
  resetBtn.className = "custom-upload-button";
  resetBtn.style.marginTop = "12px";
  resetBtn.onclick = function () {
    fileInput.value = "";
    dropArea.innerHTML = `
      <input type="file" id="${fileInput.id}" accept="image/png" style="display:none;" />
      <label for="${fileInput.id}" class="custom-upload-button">📁 Pilih file ...</label>
      <div class="drop-text">atau <span>seret & lepas file PNG ke sini</span></div>
      <small style="color:#888;display:block;margin-top:4px;">* Hanya file PNG yang diperbolehkan</small>
    `;
    delete dropArea._hasEvent; // tambahkan baris ini
    handleDropArea(dropArea.id, fileInput.id);
  };

  dropArea.appendChild(img);
  dropArea.appendChild(sizeInfo);
  dropArea.appendChild(resetBtn);
}

function handleDropArea(dropAreaId, inputId) {
  const dropArea = document.getElementById(dropAreaId);
  const fileInput = document.getElementById(inputId);

  // Hindari double event listener
  if (dropArea._hasEvent) return;
  dropArea._hasEvent = true;

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
  });

  dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event("change"));
    }
  });

  // Klik area juga membuka file dialog
  dropArea.addEventListener("click", (e) => {
    // Hanya jika bukan klik tombol pilih ulang
    if (!e.target.classList.contains("custom-upload-button")) {
      fileInput.click();
    }
  });

  // Event change untuk preview
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      showImagePreview(dropArea, fileInput, dropAreaId + "-preview");
    }
  });
}

// Inisialisasi ulang agar event terpasang dengan benar
handleDropArea("drop-area-original", "original-image");
handleDropArea("drop-area-secret", "secret-image");

// Tampilkan/hilangkan placeholder sesuai gambar
function updateEmbedStegoPreview(src) {
  const img = document.getElementById("embed-stego");
  const placeholder = document.getElementById("embed-stego-placeholder");
  if (src) {
    img.src = src;
    img.style.display = "block";
    placeholder.style.display = "none";
  } else {
    img.src = "";
    img.style.display = "none";
    placeholder.style.display = "flex";
  }
}
