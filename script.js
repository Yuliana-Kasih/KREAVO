const equipment = [
    {
        id: 1,
        name: "Kamera DSLR",
        category: "Fotografi",
        icon: "📷",
        stock: 5
    },
    {
        id: 2,
        name: "Tripod",
        category: "Fotografi",
        icon: "📸",
        stock: 8
    },
    {
        id: 3,
        name: "Laptop",
        category: "Komputer",
        icon: "💻",
        stock: 6
    },
    {
        id: 4,
        name: "Drawing Tablet",
        category: "Desain Grafis",
        icon: "🖊️",
        stock: 4
    },
    {
        id: 5,
        name: "Lighting",
        category: "Videografi",
        icon: "💡",
        stock: 7
    },
    {
        id: 6,
        name: "Microphone",
        category: "Audio",
        icon: "🎤",
        stock: 5
    }
];

// DATA PEMINJAMAN

let loans = JSON.parse(
    localStorage.getItem("kreavoLoans")
) || [];

// NAVIGASI

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.getElementById(pageId).classList.add("active-page");

    document.querySelectorAll(".sidebar nav a").forEach(link => {
        link.classList.remove("active");

        if (link.dataset.page === pageId) {
            link.classList.add("active");
        }
    });

    const titles = {
        dashboard: "Dashboard",
        katalog: "Katalog Alat",
        peminjaman: "Peminjaman",
        riwayat: "Riwayat Peminjaman",
        profil: "Profil Saya"
    };

    document.getElementById("page-title").textContent =
        titles[pageId];

    if (pageId === "riwayat") {
        renderHistory();
    }

    updateStats();
}

// EVENT NAVIGASI

document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        showPage(this.dataset.page);
    });
});

// RENDER KATALOG

function renderEquipment(items, containerId) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    items.forEach(item => {

        container.innerHTML += `
            <div class="equipment-card">

                <div class="equipment-image">
                    ${item.icon}
                </div>

                <h3>${item.name}</h3>

                <p>${item.category}</p>
                <p>Stok tersedia: ${item.stock}</p>

                <button onclick="selectEquipment(${item.id})">
                    Pinjam Sekarang
                </button>

            </div>
        `;
    });
}

// PILIH ALAT

function selectEquipment(id) {

    const selected = equipment.find(item => item.id === id);

    document.getElementById("alat").value = selected.name;

    showPage("peminjaman");
}

// ISI PILIHAN ALAT

function loadEquipmentOptions() {

    const select = document.getElementById("alat");

    equipment.forEach(item => {

        const option = document.createElement("option");

        option.value = item.name;
        option.textContent = item.name;

        select.appendChild(option);
    });
}

// PENCARIAN

document.getElementById("search").addEventListener("input", function() {

    const keyword = this.value.toLowerCase();

    const filtered = equipment.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
    );

    renderEquipment(filtered, "catalog-items");
});

// AJUKAN PEMINJAMAN

document.getElementById("loan-form").addEventListener("submit", function(event) {

    event.preventDefault();

    const nama = document.getElementById("nama").value;
    const alat = document.getElementById("alat").value;
    const jumlah = Number(document.getElementById("jumlah").value);
    const tanggal = document.getElementById("tanggal").value;
    const pengembalian = document.getElementById("pengembalian").value;
    const keperluan = document.getElementById("keperluan").value;

    const selected = equipment.find(item => item.name === alat);

    if (!selected) {
        alert("Silakan pilih alat terlebih dahulu!");
        return;
    }

    if (jumlah > selected.stock) {
        alert("Jumlah melebihi stok yang tersedia!");
        return;
    }

    if (tanggal < new Date().toISOString().split("T")[0]) {
        alert("Tanggal peminjaman tidak boleh di masa lalu!");
        return;
    }

    if (pengembalian <= tanggal) {
        alert("Tanggal pengembalian harus setelah tanggal peminjaman!");
        return;
    }

    const newLoan = {
        id: Date.now(),
        nama,
        alat,
        jumlah,
        tanggal,
        pengembalian,
        keperluan,
        status: "Menunggu"
    };

    loans.push(newLoan);

    localStorage.setItem(
        "kreavoLoans",
        JSON.stringify(loans)
    );

    alert("Pengajuan peminjaman berhasil!");

    this.reset();

    renderHistory();
    updateStats();
    showPage("riwayat");
});

// RIWAYAT

function renderHistory() {

    const history = document.getElementById("history-list");

    history.innerHTML = "";

    if (loans.length === 0) {
        history.innerHTML = `
            <tr>
                <td colspan="4">Belum ada riwayat peminjaman.</td>
            </tr>
        `;
        return;
    }

    loans.forEach(loan => {

        history.innerHTML += `
            <tr>
                <td>${loan.alat}</td>
                <td>${loan.jumlah}</td>
                <td>${loan.tanggal}</td>
                <td>
                    <span class="status">${loan.status}</span>
                </td>
            </tr>
        `;
    });
}

// UPDATE DASHBOARD

function updateStats() {

    document.getElementById("total-pinjam").textContent =
        loans.length;

    document.getElementById("total-menunggu").textContent =
        loans.filter(loan => loan.status === "Menunggu").length;

    document.getElementById("total-selesai").textContent =
        loans.filter(loan => loan.status === "Selesai").length;
}

// LOGOUT

function logout() {

    const confirmLogout = confirm("Apakah kamu yakin ingin keluar?");

    if (confirmLogout) {
        showPage("dashboard");
    }
}

// INISIALISASI

loadEquipmentOptions();

renderEquipment(equipment, "catalog-items");

renderEquipment(
    equipment.slice(0, 3),
    "popular-items"
);

renderHistory();

updateStats();
