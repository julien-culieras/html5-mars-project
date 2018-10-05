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


    /**
     * WS
     */

    let serverUrl = 'mars.docker';
    //let serverUrl = 'localhost:8080';
    let ws = null;

    initUser();
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

    function rotateUp() {
        rotate('down');
    }

    function rotateDown() {
        rotate('up');
    }

    function rotate(type) {
        let wayRotate = (type === 'down') ? -1 : 1;
        ws.sendToServer('spaceship:rotate', { angle: pasAngleRotation, direction: wayRotate });
    }

    function initUser() {
        modal.classList.add('show');
        overlay.classList.add('show');
    }

    function closeModal() {
        let userNameValue = userName.value;
        let avatarValue = avatar.value;

        if (userNameValue && avatarValue) {
            let roleValue = role.value;

            affichageUserName.innerText = 'Bienvenue ' + userNameValue + ', notre ' + roleValue + ' !';

            reader.onload = function() {
                avatarAffichage.setAttribute('src', reader.result);
                initController(teamId, userNameValue, reader.result);
            };
            reader.readAsDataURL(avatar.files[0]);

            let teamId = team.value;

            modal.classList.remove('show');
            modal.classList.add('hidden');
            overlay.classList.remove('show');
            overlay.classList.add('hidden');


        }
        else {
            if (!userNameValue) errorName.innerText = 'Veuillez entrer votre pseudo !';
            else errorName.innerText = '';
            if (!avatarValue) errorAvatar.innerText = 'Veuillez choisir votre avatar !';
            else errorAvatar.innerText = '';
        }

    }

    function setValLeftPannel(idval, jsonVal){
        document.getElementById(idval).innerText = jsonVal;
    }
};
