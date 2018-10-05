window.onload = function () {

    /**
     * Elements serveur
     */
    let puissancePropulseur = 0.5;
    let interval = null;
    let angleRotation = 0;
    const timeMove = 500;
    const pasAngleRotation = 15;
    const angleBase = 45;
    let userNameValue = null;

    /**
     * Elements DOM
     */
    const btnAvancer = document.getElementById('btnAvancer');
    const affichagePropulseur = document.getElementById('affichagePropulseur');
    const rangePropulseur = document.getElementById('rangePropulseur');
    const btnRotateUp = document.getElementById('btnRotateUp');
    const btnRotateDown = document.getElementById('btnRotateDown');
    const rocket = document.getElementById('rocketIcon');
    const affichageAngleRotation = document.getElementById('affichageAngleRotation');
    const modal = document.getElementById('modal');
    const overlay = document.querySelector('.overlay');
    const btnValiderModal = document.getElementById('btnValiderModal');
    const userName = document.getElementById('userName');
    const role = document.getElementById('role');
    const avatar = document.getElementById('avatar');
    const team = document.getElementById('team');
    const affichageUserName = document.getElementById('affichageUserName');
    const errorName = document.getElementById('errorName');
    const errorAvatar = document.getElementById('errorAvatar');
    const reader = new FileReader();
    const avatarAffichage = document.getElementById('avatarAffichage');

    /**
     * Events DOM
     */
    rangePropulseur.addEventListener('change', changePuissancePropulseur);
    btnValiderModal.addEventListener('click', closeModal);

    /**
     * WS
     */

    let serverUrl = 'mars.docker';
    //let serverUrl = 'localhost:8080';
    let ws = null;

    initModal();
    changePuissancePropulseur();

    function initController(teamId, username, avatar) {
        ws = new WebSocket(`ws://${serverUrl}?team=${teamId}&username=${username}&job=Pilot`);

        ws.sendToServer = function(name, data) {
            const message = JSON.stringify({ name, data });
            this.send(message);
        };

        ws.onmessage = (message) => {
            const { name, data, error } = JSON.parse(message.data);

            rocket.style.transform = "rotate(" + (data.angle + angleBase) + "deg)";
            affichageAngleRotation.innerText = data.angle + ' °';

            setValLeftPannel('spanAngle', data.angle + ' °');
            setValLeftPannel('spanLife', data.life);
            setValLeftPannel('spanTurnToAngle', data.turnTo + ' °');
            setValLeftPannel('spanXPosition', Math.round(data.x));
            setValLeftPannel('spanYPosition', Math.round(data.y));
            setValLeftPannel('spanAngleTourelle', data.turretAngle + ' °');
            setValLeftPannel('spanTurnToAngleTourelle', data.turretTurnTo + ' °');
            setValLeftPannel('spanReloading', data.reloading ? 'Yes' : 'False');
            setValLeftPannel('spanReloaded', data.reloaded ? 'Yes' : 'False');
            setValLeftPannel('spanSystemHealth', Math.round(data.systemPower * 100) + ' %');
            setValLeftPannel('spanShield', Math.round(data.shieldPower * 100) + ' %');
            setValLeftPannel('spanThrusterPower', Math.round(data.systemPower * 100) + ' %');
        };

        ws.onopen = (state) => {
            ws.sendToServer('user:avatar', { avatar: avatar });

            /**
             * Events Server
             */
            btnAvancer.addEventListener('mousedown', avancer);
            btnAvancer.addEventListener('mouseup', stop);
            btnRotateUp.addEventListener('click', rotate);
            btnRotateDown.addEventListener('click', rotate);

            document.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight') avancer();
                else if (event.key === 'ArrowUp') rotate('up');
                else if (event.key === 'ArrowDown') rotate('down');
            });

            document.addEventListener('keyup', (event) => {
                if (event.key === 'ArrowRight') stop();
            });
        }

    }

    function avancer() {
        if (!interval){
            interval = setInterval(function () {
                ws.sendToServer('spaceship:move', { time: timeMove, power: puissancePropulseur });
            }, timeMove)
        }
    }


    function stop() {
        clearInterval(interval);
        interval = null;
    }

    function changePuissancePropulseur() {
        affichagePropulseur.innerText = rangePropulseur.value + ' / ' + rangePropulseur.getAttribute('max');
        puissancePropulseur = rangePropulseur.value/rangePropulseur.getAttribute('max');
    }

    function rotate(event) {
        let wayRotate = (event === 'down' || (event.srcElement !== undefined && event.srcElement.getAttribute('data-move') === 'down')) ? -1 : 1;
        ws.sendToServer('spaceship:rotate', { angle: pasAngleRotation, direction: wayRotate });
    }

    function initModal() {
        modal.classList.add('show');
        overlay.classList.add('show');
    }

    function closeModal() {
        let userNameValue = userName.value;
        let avatarValue = avatar.value;

        if (userNameValue && avatarValue) {
            affichageUserName.innerText = 'Bienvenue ' + userNameValue + ', notre ' + role.value + ' !';

            reader.onload = function() {
                avatarAffichage.setAttribute('src', reader.result);
                initController(team.value, userNameValue, reader.result);
            };
            reader.readAsDataURL(avatar.files[0]);

            modal.classList.remove('show');
            modal.classList.add('hidden');
            overlay.classList.remove('show');
            overlay.classList.add('hidden');
        } else {
            errorName.innerText = (!userNameValue) ? 'Veuillez entrer votre pseudo !' : '';
            errorAvatar.innerText = (!avatarValue) ? 'Veuillez choisir votre avatar !' : '';
        }

    }

    function setValLeftPannel(idval, jsonVal){
        document.getElementById(idval).innerText = jsonVal;
    }
};
