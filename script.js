// ===============================
// KONFIGURASI DASAR
// ===============================

// Tanggal acara: 20 Februari 2026 pukul 10:00 WIB
// Perhatikan: bulan di Date() dimulai dari 0 (0 = Jan, 1 = Feb, dst)
const eventDate = new Date(2026, 1, 20, 10, 0, 0); // 20/02/2026 10:00

// ===============================
// MUSIC AUTOPLAY (dengan fallback)
// ===============================

const bgMusic = document.getElementById("bg-music");

// Coba putar otomatis; jika browser blokir, akan diabaikan
if (bgMusic) {
  bgMusic.volume = 0.85; // volume sedikit diturunkan

  // Beberapa browser perlu interaksi pengguna untuk memutar audio
  const enableAudioOnInteraction = () => {
    bgMusic
      .play()
      .catch(() => {
        // Jika masih gagal, dibiarkan saja (user bisa play manual dari kontrol browser)
      });
    window.removeEventListener("click", enableAudioOnInteraction);
    window.removeEventListener("touchstart", enableAudioOnInteraction);
  };

  window.addEventListener("click", enableAudioOnInteraction);
  window.addEventListener("touchstart", enableAudioOnInteraction);
}

// ===============================
// COUNTDOWN TIMER
// ===============================

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const messageEl = document.getElementById("countdown-message");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Jika acara sudah lewat
  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    if (messageEl) {
      messageEl.textContent = "Acara telah dimulai atau selesai. Terima kasih atas doa dan kehadiran Anda.";
    }
    return;
  }

  // Hitung sisa waktu
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Tampilkan dengan format dua digit
  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  if (messageEl) {
    messageEl.textContent = "Kami tidak sabar menantikan kehadiran Anda di hari istimewa kami.";
  }
}

// Jalankan countdown setiap detik
updateCountdown();
setInterval(updateCountdown, 1000);

// ===============================
// MODAL RSVP
// ===============================

const openRsvpBtn = document.getElementById("open-rsvp");
const rsvpModal = document.getElementById("rsvp-modal");
const closeRsvpBtn = document.getElementById("close-rsvp");
const rsvpForm = document.getElementById("rsvp-form");
const thankYouMessage = document.getElementById("thank-you-message");

// Fungsi untuk membuka modal
function openModal() {
  if (!rsvpModal) return;
  rsvpModal.classList.add("show");
}

// Fungsi untuk menutup modal
function closeModal() {
  if (!rsvpModal || !rsvpForm || !thankYouMessage) return;
  rsvpModal.classList.remove("show");

  // Reset form & pesan ketika modal ditutup
  rsvpForm.style.display = "block";
  rsvpForm.reset();
  thankYouMessage.style.display = "none";
  thankYouMessage.textContent = "";
}

// Event buka modal
if (openRsvpBtn) {
  openRsvpBtn.addEventListener("click", openModal);
}

// Event tutup modal dengan tombol X
if (closeRsvpBtn) {
  closeRsvpBtn.addEventListener("click", closeModal);
}

// Tutup modal jika klik di luar konten
if (rsvpModal) {
  rsvpModal.addEventListener("click", (e) => {
    if (e.target === rsvpModal) {
      closeModal();
    }
  });
}

// Tangani submit form RSVP
if (rsvpForm) {
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("guest-name");
    const attendanceSelect = document.getElementById("attendance");

    if (!nameInput || !attendanceSelect || !thankYouMessage) return;

    const name = nameInput.value.trim();
    const attendance = attendanceSelect.value;

    // Buat pesan terima kasih personal
    let message = `Terima kasih, ${name || "Tamu yang Terhormat"}, atas konfirmasi Anda. `;
    if (attendance === "hadir") {
      message += "Kami sangat berbahagia karena Anda berkenan hadir di hari pernikahan kami.";
    } else if (attendance === "tidak_hadir") {
      message += "Terima kasih atas doa dan perhatian Anda, semoga kita dapat bertemu di lain kesempatan.";
    } else {
      message += "Terima kasih atas doa dan dukungan Anda.";
    }

    // Sembunyikan form, tampilkan pesan
    rsvpForm.style.display = "none";
    thankYouMessage.textContent = message;
    thankYouMessage.style.display = "block";

    // Tampilkan efek confetti
    launchConfetti();
  });
}

// ===============================
// CONFETTI EFFECT
// ===============================

function launchConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  if (!confettiContainer) return;

  const colors = ["#ffdde1", "#fec5e5", "#ffb3c6", "#ffc8dd", "#f9a8d4"];

  const confettiCount = 150; // jumlah confetti

  for (let i = 0; i < confettiCount; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");

    // Posisi horizontal acak (0-100%)
    piece.style.left = Math.random() * 100 + "vw";

    // Warna acak
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.backgroundColor = color;

    // Waktu mulai acak agar jatuhnya tidak bersamaan
    const delay = Math.random() * 0.8;
    piece.style.animationDelay = delay + "s";

    // Durasi animasi juga bisa sedikit diacak
    const duration = 2.2 + Math.random() * 1.1;
    piece.style.animationDuration = duration + "s";

    confettiContainer.appendChild(piece);

    // Hapus elemen setelah animasi selesai untuk mencegah penumpukan di DOM
    setTimeout(() => {
      piece.remove();
    }, (duration + delay) * 1000);
  }
}

// ===============================
// FLOATING HEARTS / BUNGA
// ===============================

const floatingContainer = document.getElementById("floating-elements-container");

// Beberapa karakter romantis: hati & bunga
const floatingChars = ["❤", "♡", "❀", "❁", "❣"];

// Buat elemen melayang secara berkala
function createFloatingElement() {
  if (!floatingContainer) return;

  const span = document.createElement("span");
  span.classList.add("floating-item");
  span.textContent = floatingChars[Math.floor(Math.random() * floatingChars.length)];

  // Posisi horizontal acak
  span.style.left = Math.random() * 100 + "vw";

  // Durasi animasi sedikit diacak agar lebih natural
  const duration = 6 + Math.random() * 4;
  span.style.animationDuration = duration + "s";

  // Ukuran sedikit diacak
  const size = 0.9 + Math.random() * 0.8;
  span.style.fontSize = size + "rem";

  floatingContainer.appendChild(span);

  // Hapus setelah animasi selesai
  setTimeout(() => {
    span.remove();
  }, duration * 1000);
}

// Interval untuk membuat floating hearts/bunga baru
setInterval(createFloatingElement, 900);

// Jalankan beberapa elemen di awal agar tidak kosong
for (let i = 0; i < 8; i++) {
  setTimeout(createFloatingElement, i * 300);
}
