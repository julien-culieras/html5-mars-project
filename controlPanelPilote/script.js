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
    let userNameValue = null;

    /*
     Elements DOM
     */
    const btnAvancer = document.getElementById('btnAvancer');
    const affichagePropulseur = document.getElementById('affichagePropulseur');
    const rangePropulseur = document.getElementById('rangePropulseur');
    const btnRotateUp = document.getElementById('btnRotateUp');
    const btnRotateDown = document.getElementById('btnRotateDown');
    const rocket = document.getElementById('rocketIcon');
    const affichageAngleRotation = document.getElementById('affichageAngleRotation');
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    const btnValiderModal = document.getElementById('btnValiderModal');
    const userName = document.getElementById('userName');

    initUser();

    let oldRotate = rocket.style;
    changePuissancePropulseur();


    btnAvancer.addEventListener('mousedown', avancer);
    btnAvancer.addEventListener('mouseup', stop);
    rangePropulseur.addEventListener('change', changePuissancePropulseur);

    btnRotateUp.addEventListener('click', rotateUp);
    btnRotateDown.addEventListener('click', rotateDown);

    btnValiderModal.addEventListener('click', closeModal);



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



        angleRotation = (angle - 45) % 360;
        affichageAngleRotation.innerText = angleRotation + ' °';
        /*
          spaceship:turnto(angleRotation);
         */

    }

    function initUser() {
        modal.style.transition = '500ms linear';
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function closeModal() {
        userNameValue = userName.value;
        

        modal.style.transition = '500ms linear';
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }


};


