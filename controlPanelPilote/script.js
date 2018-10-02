window.onload = function () {

    /*
     Elements serveur
     */
    let puissancePropulseur = 0.5;
    let interval = null;
    let angleRotation = 180;
    const timeMove = 100;

    /*
     Elements DOM
     */
    const btnAvancer = document.getElementById('btnAvancer');
    const affichagePropulseur = document.getElementById('affichagePropulseur');
    const rangePropulseur = document.getElementById('rangePropulseur');

    changePuissancePropulseur();

    btnAvancer.addEventListener('mousedown', avancer);
    btnAvancer.addEventListener('mouseup', stop);
    rangePropulseur.addEventListener('change', changePuissancePropulseur);


    function avancer() {
        interval = setInterval(function () {
            console.log('Avance 100ms');
        }, timeMove)
    }


    function stop() {
        clearInterval(interval);
        console.log('Le vaisseaux s\'arrete');
    }

    function changePuissancePropulseur() {
        affichagePropulseur.innerText = rangePropulseur.value + ' / ' + rangePropulseur.getAttribute('max');
        puissancePropulseur = rangePropulseur.value/rangePropulseur.getAttribute('max');
        console.log(puissancePropulseur)
    }
};


