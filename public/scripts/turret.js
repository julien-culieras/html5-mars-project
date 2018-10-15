window.onload = function()
{
    // *****************************************************
    //                       VARIABLES
    // *****************************************************
    const btnRotateLeft = document.getElementById('rotate_btn_left');
    const btnRotateRight = document.getElementById('rotate_btn_right');
    const btnTurnToZero = document.getElementById('rotate_btn_0');
    const btnTurnOver = document.getElementById('rotate_btn_180');

    const btnFire25 = document.getElementById('fire_btn_25');
    const btnFire50 = document.getElementById('fire_btn_50');
    const btnFire75 = document.getElementById('fire_btn_75');
    const btnFire100 = document.getElementById('fire_btn_100');

    const btnMoveUp = document.getElementById('btnMoveUp');
    const btnMoveForward = document.getElementById('btnMoveForward');
    const btnMoveDown = document.getElementById('btnMoveDown');

    const modal = document.getElementById('myModal');
    const modalForm = document.getElementById('modalForm');
    const username = document.getElementById('username');
    const roleList = document.getElementById('roleList');
    const teamList = document.getElementById('teamList');
    const avatar = document.getElementById('avatar');
    const displayUserName = document.getElementById('displayUserName');
    const displayRole = document.getElementById('displayRole');
    const avatarDisplay = document.getElementById('avatarDisplay');

    const spanLife = document.getElementById('spanLife');
    const spanAngle = document.getElementById('spanAngle');
    const spanTurnToAngle = document.getElementById('spanTurnToAngle');
    const spanXPosition = document.getElementById('spanXPosition');
    const spanYPosition = document.getElementById('spanYPosition');
    const spanAngleTourelle = document.getElementById('spanAngleTourelle');
    const spanTurnToAngleTourelle = document.getElementById('spanTurnToAngleTourelle');
    const spanReloading = document.getElementById('spanReloading');
    const spanReloaded = document.getElementById('spanReloaded');
    const spanSystemHealth = document.getElementById('spanSystemHealth');
    const spanShield = document.getElementById('spanShield');
    const spanThrusterPower = document.getElementById('spanThrusterPower');

    const reader = new FileReader();
    var ws;

    // *****************************************************
    //                       PROGRAM
    // *****************************************************
    initModal();  // Display the modal on page loading

    // *****************************************************
    //                       EVENTS
    // *****************************************************
    modalForm.addEventListener('submit', closeModal);

    btnRotateLeft.addEventListener('click', rotateLeft);
    btnRotateRight.addEventListener('click', rotateRight);
    btnTurnOver.addEventListener('click', turnOver);
    btnTurnToZero.addEventListener('click', turnToZero);

    btnFire25.addEventListener('click', fire25);
    btnFire50.addEventListener('click', fire50);
    btnFire75.addEventListener('click', fire75);
    btnFire100.addEventListener('click', fire100);

    btnMoveUp.addEventListener('click', moveUp);
    btnMoveForward.addEventListener('click', moveForward);
    btnMoveDown.addEventListener('click', moveDown);

    // Gestion keyboard keys
    document.addEventListener('keydown', (event) =>
    {
        console.log(event.key);
        if (event.key === 'ArrowRight') rotateRight();
        else if (event.key === 'ArrowLeft') rotateLeft();
        else if (event.key === 'ArrowUp') turnToZero();
        else if (event.key === 'ArrowDown') turnOver();
        else if (event.key === 'a') fire25();
        else if (event.key === 'z') fire50();
        else if (event.key === 'e') fire75();
        else if (event.key === 'r') fire100();
        else if (event.key === 'q') moveDown();
        else if (event.key === 's') moveForward();
        else if (event.key === 'd') moveUp();
    });

    window.addEventListener("gamepadconnected", function(e)
    {
      const gamepad = e.gamepad;
      console.log(gamepad);
      setInterval(function()
      {
        gamepad.buttons.forEach(function(button, index)
        {
          if (button.pressed)
          {
            console.log(`button ${index} pressed ${button.value}`);
            if (index == 0) //Button A
            {
              fire25();
            }

            else if (index == 1) //Button B
            {
              fire50();
            }

            else if (index == 2)// Button X
            {
              fire75();
            }

            else if (index == 3) //Button Y
            {
              fire100();
            }

            else if (index == 14)
            {
              rotateLeft();
            }

            else if (index == 15)
            {
              rotateRight();
            }

            else if (index == 12)
            {
              // turnToZero();
              moveUp();
            }

            else if (index == 13)
            {
              // turnToZero();
              moveDown();
            }

            else if (index == 7)
            {
              moveForward();
            }

            else if (index == 8)
            {
              lightSpeed();
            }

            else if (index == 9)
            {
              maxShield();
            }

            else if (index == 4)
            {
              maxSystemPower();
            }
          }
        });
      }, 100);
    });

    // Call the modal requesting the user name and his role
    function initModal()
    {
        modal.style.display = 'block';
    }
    // Close the modal when clicking on the form's submit button
    function closeModal(e)
    {
      displayUserName.textContent = username.value;
      displayRole.textContent = roleList.value;
      modal.style.display = 'none';

      // reader.onload = function()
      // {
      //     reader.readAsDataURL(avatar.value.files[0]);
      //     avatarDisplay.setAttribute('src', reader.result);
      //     console.log(reader.result);
      // }

      wsConnection();
      e.preventDefault(); //Prevent from sending the form's data when clicking on the submit button
    }

    // Connection with the websocket
    function wsConnection ()
    {
      const url = '92.222.88.16:9090';
      const team = 4;
      const user = username.value;
      const job = roleList.value;
      ws = new WebSocket(`ws://${url}?team=${team}&username=${user}&job=${job}`);

      // ws.send(JSON.stringify({name : 'user:avatar', data: { avatar: reader.result }}));

      ws.onopen = function ()
      {
        console.log("socket open with server !");
      };

      ws.onmessage = function (message)
      {
        message = JSON.parse(message.data);
        console.log(message.data);

        spanLife.textContent = message.data.life;
        spanAngle.textContent = message.data.angle;
        spanTurnToAngle.textContent = message.data.turnTo;
        spanXPosition.textContent = Math.round(message.data.x);
        spanYPosition.textContent = Math.round(message.data.y);
        spanAngleTourelle.textContent = message.data.turretAngle;
        spanTurnToAngleTourelle.textContent = message.data.turretTurnTo;
        spanReloading.textContent = message.data.reloading;
        spanReloaded.textContent = message.data.reloaded;
        spanSystemHealth.textContent = message.data.systemPower;
        spanShield.textContent = message.data.shieldPower;
        spanThrusterPower.textContent = message.data.thrusterPower;
      };

      return ws;
    };

    // - - - - - - - - - - -  FUNCTIONS - - - - - - - - - - -

    // Rotate the turret to the left
    function rotateLeft()
    {
        console.log('Rotating left !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:rotate', data: { angle: 5, direction: -1 }}));
    }
    // Rotate the turret to the right
    function rotateRight()
    {
        console.log('Rotating left !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:rotate', data: { angle: 5, direction: 1 }}));
    }
    // Rotate the turret to 180°
    function turnOver()
    {
        console.log('Turning Over !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:turnto', data: { angle: 180 }}));
    }
    // Rotate the turret to 0°
    function turnToZero()
    {
        console.log('Turning to zero !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:turnto', data: { angle: 0 }}));
    }

    // Shoot at 25% of power
    function fire25()
    {
        console.log('Firing at 25% !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:fire', data: { power: -10 }}));
    }
    // Shoot at 50% of power
    function fire50()
    {
        console.log('Firing at 50% !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:fire', data: { power: 0.25 }}));
    }
    // Shoot at 75% of power
    function fire75()
    {
        console.log('Firing at 75% !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:fire', data: { power: 0.75 }}));
    }
    // Shoot at 25% of power
    function fire100()
    {
        console.log('Firing at 100% !');
        ws.send(JSON.stringify({ name: 'spaceship:turret:fire', data: { power: 1 }}));
    }

    // Move Up
    function moveUp()
    {
      ws.send(JSON.stringify({ name: 'spaceship:rotate', data: { angle: 15, direction: -1 }}));
    }
    // Move Forward
    function moveForward()
    {
      ws.send(JSON.stringify({ name: 'spaceship:move', data: { time: 500, power: 1 }}));
    }
    // Move Down
    function moveDown()
    {
      ws.send(JSON.stringify({ name: 'spaceship:rotate', data: { angle: 15, direction: 1 }}));
    }

    // Put the ship' speed to the maximum !
    function lightSpeed()
    {
      ws.send(JSON.stringify({ name: 'spaceship:thruster:power', data: { power: 1 }}));
    }
    // Put the ship' shield to the maximum !
    function maxShield()
    {
      ws.send(JSON.stringify({ name: 'spaceship:shield:power', data: { power: 1 }}));
    }
    function maxSystemPower()
    {
      ws.send(JSON.stringify({ name: 'spaceship:system:power', data: { power: 1 }}));
    }



  };
