const noteArea = document.getElementById("noteArea");
const searchInput = document.getElementById("searchInput");

// Cargar nota desde localStorage al iniciar la página
window.onload = () => {
    const savedNote = localStorage.getItem("note");
    if (savedNote) {
        noteArea.innerText = savedNote;
    }
    showHistory();  // Mostrar el historial correctamente al cargar la página
};

// Guardar automáticamente la nota mientras el usuario escribe
noteArea.addEventListener("input", () => {
    localStorage.setItem("note", noteArea.innerText);
});

function saveNote() {
    const note = noteArea.innerText;
    localStorage.setItem("note", note);
    alert("¡Nota guardada!");
}

function clearNote() {
    if (confirm("¿Seguro que deseas limpiar la nota?")) {
        noteArea.innerText = "";
        localStorage.removeItem("note");
        alert("Nota limpiada.");
    }
}

function downloadNote() {
    const note = noteArea.innerText;
    if (!note.trim()) {
        alert("No hay contenido para descargar.");
        return;
    }

    let fileName = note.split(/\s+/).slice(0, 3).join("_") || "nota"; // Primeras 3 palabras
    fileName = fileName.replace(/[^\w\d_-]/g, ""); // Remover caracteres especiales
    fileName += ".txt";

    const blob = new Blob([note], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    addToHistory(fileName);
    showHistory();  // <-- Se actualiza la vista del historial inmediatamente
}


function searchWord() {
    const text = noteArea.innerText;
    const search = searchInput.value.trim();

    if (!search) return;

    const regex = new RegExp(`(${search})`, "gi");

    if (!regex.test(text)) {
        alert(`La palabra "${search}" no se encontró.`);
        return;
    }

    const highlightedText = text.replace(regex, '<mark>$1</mark>');
    noteArea.innerHTML = highlightedText;

    const firstMark = noteArea.querySelector("mark");
    if (firstMark) {
        firstMark.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function toggleHistory() {
    const history = document.getElementById("history");
    history.style.display = history.style.display === "block" ? "none" : "block";
    if (history.style.display === "block") {
        showHistory();  // Mostrar historial cuando esté visible
    }
}

function addToHistory(fileName) {
    const history = JSON.parse(localStorage.getItem("history")) || [];  
    history.push(fileName);
    localStorage.setItem("history", JSON.stringify(history));
}

function showHistory() {
    const historyList = document.getElementById("historyList");
    const history = JSON.parse(localStorage.getItem("history")) || [];  
    historyList.innerHTML = history.length === 0 ? "<p>No hay historial disponible.</p>" : "";

    history.forEach((fileName, index) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `<span>${fileName}</span> <button onclick="deleteHistory(${index})">🗑</button>`;
        historyList.appendChild(div);
    });
}

function deleteHistory(index) {
    const history = JSON.parse(localStorage.getItem("history")) || [];  
    history.splice(index, 1);
    localStorage.setItem("history", JSON.stringify(history));
    showHistory();
}

