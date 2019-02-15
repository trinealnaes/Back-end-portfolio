// LOGG INN
// HTML-elementer 
const welcomeMessage = document.querySelector("header h1");
const profilbilde = document.querySelector("header img");

firebase.auth().onAuthStateChanged(user =>  {
    if (user) {
        welcomeMessage.innerText = "Welcome " + user.displayName;
        profilbilde.src = user.photoURL;
        console.log(user)
    } else {
        document.location.href = "logginn.html";
    }
});


// HTML-elementer
// Bildeskjema
const skjemaBilder = document.querySelector("#skjemaBilder"); // Form-elementet for bildeopplasting
const inpBilde = document.querySelector("#inpBilde"); // Velg bilde
const infoBilde = document.querySelector("#infoBilde"); // Infoom bildefilen som er lastet opp (automatisk)
const inpTekst = document.querySelector("#inpTekst"); // Beskrivelse av bildet
const ulBilder = document.querySelector("#ulBilder"); // Liste over bildene som er lastet opp
const infoOpplasting = document.querySelector("#infoOpplasting"); // "Ingen bilder lastet opp ennå"

// Tekstskjema
const skjemaInfo = document.querySelector("#skjemaInfo"); // Form-element for tekst til prosjektet
const inpTittel = document.querySelector("#inpTittel"); // Tittel til prosjektet
const fagfelt = document.querySelector("#fagfelt") // Fagfelt for prosjektet
const verktoy = document.querySelector("#verktoy") // Verktøy til prosjektet
const taBeskrivelse = document.querySelector("#taBeskrivelse"); // Beksrivelse/tekst til prosjektet


// Firebase / DATABASE-kobling
const db = firebase.database();
const storage = firebase.storage();

// Hvor i databasen skal vi lagre prosjektene
const prosjekter = db.ref("prosjekt");

// Et array til å lagre bildene før vi legger inn i databasen
const bilderSomSkalLastesOpp = [];

// En hjelpefunksjon som jeg fant på nett for å regne om filstørrelser
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}


// Viser informasjon om bildet som skal lastes opp
function visBildeinfo() {
    const bilde = inpBilde.files[0];

    const filnavn = bilde.name;
    const bytes = bilde.size;
    const storrelse = bytesToSize(bytes);

    infoBilde.innerText = filnavn + "  " + storrelse;
}


// Laster opp et bilde til storage og lagrer url og info i arrayet
function lastOppBilde(evt) {
    evt.preventDefault();
    overlay.style.display = "flex";

    const bilde = inpBilde.files[0];
    const filnavn = bilde.name;
    const lagringsPlass = storage.ref("mineprosjektbilder/" + new Date() + bilde.filnavn);

    lagringsPlass.put(bilde)
        .then( opplastetBilde => opplastetBilde.ref.getDownloadURL() )
        .then ( url => {
            bilderSomSkalLastesOpp.push({
                url: url,
                tekst: inpTekst.value
            });
            overlay.style.display = "none";
            const div = document.createElement("div"); // linje under: viser ikonet for et bilde - (${bilde})
            div.innerHTML = `
                <img src="./ikoner/icon-image-128.png"> 
                <span>${filnavn}</span>
            `;

            ulBilder.appendChild( div );
            div.animate([
                { transform: "translateX(-300px)" },
                { transform: "translateX(0)" }
            ], 500);

            let tekst = "bilde";
            if(bilderSomSkalLastesOpp.length > 1) {
                tekst = "bilder"; // Hvis bildet er lastet opp vises bildefilnavnet
            }

            infoOpplasting.innerText = bilderSomSkalLastesOpp.length + " " + tekst + " er lastet opp"; // ≈ 1 bilde er lastet opp
            infoOpplasting.innerText = `${bilderSomSkalLastesOpp.length} ${tekst} er lastet opp`; // ???

        } );
}

// Lagrer prosjektet
function lagreProsjekt(evt) {
    evt.preventDefault();
    if(bilderSomSkalLastesOpp.length < 1) {
        alert("Du må laste opp ett eller flere bilder");
        return;
    }

    // Hva skal innlegget på nettsiden inneholde?
    prosjekter.push({
        tittel: inpTittel.value,
        fagfelt: fagfelt.value,
        bilder: bilderSomSkalLastesOpp,
        beskrivelse: taBeskrivelse.value,
        verktoy: verktoy.value
    });

    skjemaBilder.reset();
    skjemaInfo.reset();
}


// Event Listeners
inpBilde.addEventListener("change", visBildeinfo);
skjemaBilder.addEventListener("submit", lastOppBilde);
skjemaInfo.addEventListener("submit", lagreProsjekt);