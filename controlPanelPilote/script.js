window.onload = function () {

    /*
     Elements serveur
     */
    let puissancePropulseur = 0.5;
    let interval = null;
    let angleRotation = 0;
    const timeMove = 100;
    const pasAngleRotation = 15;
    const angleBase = 45;

    /*
     Elements DOM
     */
    const btnAvancer = document.getElementById('btnAvancer');
    const affichagePropulseur = document.getElementById('affichagePropulseur');
    const rangePropulseur = document.getElementById('rangePropulseur');
    const btnRotateUp = document.getElementById('btnRotateUp');
    const btnRotateDown = document.getElementById('btnRotateDown');
    const rocket = document.getElementById('rocketIcon');

    let oldRotate = rocket.style;
    console.log(oldRotate);

    changePuissancePropulseur();

    btnAvancer.addEventListener('mousedown', avancer);
    btnAvancer.addEventListener('mouseup', stop);
    rangePropulseur.addEventListener('change', changePuissancePropulseur);

    btnRotateUp.addEventListener('click', rotateUp);
    btnRotateDown.addEventListener('click', rotateDown);


    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') avancer();
        else if (event.key === 'ArrowUp') rotateUp();
        if (event.key === 'ArrowDown') rotateDown();
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowRight') stop();
    });


    function avancer() {
        if (!interval){
            interval = setInterval(function () {
                console.log('Avance 100ms');
                /*
                spaceship:move(timeMove, puissancePropulseur);
                */
            }, timeMove)
        }
    }


    function stop() {
        clearInterval(interval);
        interval = null;
        console.log('Le vaisseaux s\'arrete');
    }

    function changePuissancePropulseur() {
        affichagePropulseur.innerText = rangePropulseur.value + ' / ' + rangePropulseur.getAttribute('max');
        puissancePropulseur = rangePropulseur.value/rangePropulseur.getAttribute('max');
        console.log(puissancePropulseur)
    }

    function rotateUp() {
        rotate('down');
    }

    function rotateDown() {
        rotate('up');
    }

    function rotate(type) {
        let oldRotate = rocket.style.transform;
        let newRotate = null;
        let angle = null;

        if (!oldRotate) oldRotate = angleBase;
        else oldRotate = oldRotate.substring(oldRotate.indexOf("(") + 1, oldRotate.indexOf("deg"));

        oldRotate = Number(oldRotate);

        if (type === 'down'){
            angle = oldRotate - pasAngleRotation;
            newRotate = "rotate(" + angle + "deg)";
            rocket.style.transform = newRotate;
        }
        else{
            angle = oldRotate + pasAngleRotation;
            newRotate = "rotate(" + angle + "deg)";
            rocket.style.transform = newRotate;
        }

        angleRotation = angle - 45;

        /*
          spaceship:turnto(angleRotation);
         */

    }
};


