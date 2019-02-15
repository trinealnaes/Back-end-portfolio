// HTML-elementer
const main = document.querySelector("main");


// Firebase / DATABASE-kobling
const db = firebase.database();

// Hvor i databasen skal vi lagre prosjektene
const prosjekter = db.ref("prosjekt");

function visProsjekt(snap) {
    const id = snap.key;
    const nyttProsjekt = snap.val();

    // Kan nummerere bildene etter hvor de skal ligge og gi de klasse for å style de i css
    main.innerHTML += `
    <div class="scroll-container" id="${id}">
        <article id="prosjekt-section">
            <div id="section1">
                <h1 class="prosjekt-tittel">${nyttProsjekt.tittel}</h1>
                <img class="bilde1" src="${nyttProsjekt.bilder[0].url}"> 
                <div class="prosjekt-bakgrunn"></div>
                <p class="prosjekt-fagfelt">${nyttProsjekt.fagfelt}</p>
            </div>
            <div id="section2">
                <img class="bilde2" src="${nyttProsjekt.bilder[1].url}">
                <div class="tekstfelt">
                    <p class="prosjekt-beskrivelse">${nyttProsjekt.beskrivelse}</p>
                    <h3>Verktøy</h3>
                    <p class="prosjekt-verktoy">${nyttProsjekt.verktoy}</p>
                </div>
            </div>
            <div id="section3">
                <video class="bilde3" src="${nyttProsjekt.bilder[2].url}" controls></video>
                <img class="bilde3" src="${nyttProsjekt.bilder[2].url}">
            </div>
        </article>

        <div onclick="kryssUtProsjekt('${id}')" class="kryss-ut fas fa-times"></div>
        <div onclick="lesMerOmProsjekt('${id}')" class="les-mer">Mer</div>
    </div>

    `;
}

// Endre ansikt
function mainFace() {
    const frontImg = document.querySelector("#header-img");
    frontImg.style.backgroundImage = `url("bilder/face-front.png")`;
}

function liftedEyebrow() {
    const frontImg = document.querySelector("#header-img");

    frontImg.style.backgroundImage = `url("bilder/face-lifted-eyebrow.png")`;
}

function whatFace() {
    const frontImg = document.querySelector("#header-img");

    frontImg.style.backgroundImage = `url("bilder/face-what.png")`;
}

function winkFace() {
    const frontImg = document.querySelector("#header-img");

    frontImg.style.backgroundImage = `url("bilder/face-wink.png")`;
}

// Les mer-funksjon
function lesMerOmProsjekt(id) {
    const scrollContainer = document.querySelector(`#${id}`);
    const lesMer = scrollContainer.querySelector(".les-mer");
    const kryssUt = scrollContainer.querySelector(".kryss-ut");
    
    if(lesMer.innerHTML === "Mer") {
        lesMer.style.visibility = "hidden";
        kryssUt.style.visibility = "visible";
    } else {
        lesMer.innerHTML = "Mer";
    } 

    scrollContainer.style.overflowX = "scroll";
}

function kryssUtProsjekt(id) {
    const scrollContainer = document.querySelector(`#${id}`);
    const lesMer = scrollContainer.querySelector(".les-mer");
    const kryssUt = scrollContainer.querySelector(".kryss-ut");
    
    if(kryssUt.style.visibility = "visible") {
        kryssUt.style.visibility = "hidden";
        lesMer.style.visibility = "visible";  
        lesMer.innerHTML = "Mer"; 
    } else {
        kryssUt.style.visibility = "visible"
    }

    scrollContainer.scrollTo(0, 100);
    scrollContainer.style.overflowX = "hidden";
} 


// Eventlistener 
prosjekter.on("child_added", visProsjekt);