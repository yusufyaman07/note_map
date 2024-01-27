import { setStorage, getStorage, icons, userIcon } from "./helpers.js";
/*//! CONTROLE
console.log(`Hi JS,I am Yusuf YAMAN`)
*/
// Form'a ulaş.
const form = document.querySelector("form");
// note
const noteList = document.querySelector("ul");
//! Kordinat alma işlemi
let coords;
//! Dizi oluşturma
let notes = getStorage() || [];
//! İmleçler
let markerLayer = [];
let map;
// Haritayı Yükleyen Fonk.
function loadMap(coords) {
  map = L.map("map").setView(coords, 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  // imleç
  markerLayer = L.layerGroup().addTo(map);
  // Kullanıcı Konumuna İmleç Bas
  L.marker(coords, { icon: userIcon }).addTo(map);
  // hafızdaki notun kaybı önlendi
  renderNoteList(notes);
  // Haritadaki tıklanmayı yakalama
  map.on("click", onMapClick);
}

// Kullanıcının mevcut konumunu alan fonk.
navigator.geolocation.getCurrentPosition(
  e => {
    loadMap([e.coords.latitude, e.coords.longitude]);
  },
  () => {
    loadMap([39.953925, 32.858552]);
  }
);
// Haritadaki tıklanmayı yakalama
function onMapClick(e) {
  coords = [e.latlng.lat, e.latlng.lng];
  form.style.display = "flex";
  form[0].focus();
}
// Formu kapatma ve resetleme
form[4].addEventListener("click", () => {
  form.style.display = "none";
  form.reset();
});
//Yeni not olşturma
form.addEventListener("submit", e => {
  //Yenilemeyi Engeller
  e.preventDefault();
  // Not objesi
  const newNote = {
    id: new Date().getTime(),
    title: form[0].value,
    date: form[1].value,
    status: form[2].value,
    coords: coords,
  };
  //! Nota ekleme yapma
  notes.unshift(newNote);
  //! Notları listeleme
  renderNoteList(notes);
  //! Localstorage güncellendi
  setStorage(notes);
  //! Formu temzileme ve kapatma
  form.style.display = "none";
  form.reset();
});

//! Ekrana not ekleme
function renderNoteList(items) {
  // öncekileri temizleme
  noteList.innerHTML = "";
  markerLayer.clearLayers();
  items.forEach(note => {
    const listEleman = document.createElement("li");
    // data-id
    listEleman.dataset.id = note.id;
    listEleman.innerHTML = `
    <div class="info">
    <p>${note.title} </p>
    <p>
        <span>Date:</span>
        <span>${note.date} </span>
    </p>
    <p>
        <span>Sıtuation:</span>
        <span>${note.status} </span>
    </p>
    </div>
    <div class="ıcons">
    <i id="fly" class="bi bi-airplane-fill"></i>
    <i id="delete" class="bi bi-trash3-fill"></i>
    </div>
    `;
    noteList.appendChild(listEleman);

    renderMarker(note);
  });
}

function renderMarker(note) {
  L.marker(note.coords, { icon: icons[note.status] }).addTo(markerLayer).bindPopup(note.title);
}

noteList.addEventListener('click', (e) => {
    // tıklanılan elemanın id'sine erişme
    const found_id = e.target.closest('li').dataset.id;
  
    if (
      e.target.id === 'delete' &&
      confirm('Do you confirm the deletion?')
    ) {
      // idsini bildiğimiz elmanı diziden çıkart
      notes = notes.filter((note) => note.id != found_id);
  
      // lokal'i güncelle
      setStorage(notes);
  
      // ekranı güncelle
      renderNoteList(notes);
    }
  
    if (e.target.id === 'fly') {
      // id'sini bildiğimiz elmanı dizideki haline erişme
      const note = notes.find((note) => note.id == found_id);
  
      // not'un kordinatlarına git
      map.flyTo(note.coords);
    }
  });
 

