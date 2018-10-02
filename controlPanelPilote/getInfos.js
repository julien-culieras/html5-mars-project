window.onload = function () {
    /*
    ws.onmessage = (message) => {
        const { name, data, error } = JSON.parse(message.data);
        spaceshipData = data;

        document.getElementById('spaceship-life').innerHTML = `${data.life}`;
        document.getElementById('spaceship-x').innerHTML = `${Math.round(data.x)}`;
        document.getElementById('spaceship-y').innerHTML = `${Math.round(data.y)}`;

        document.getElementById('spaceship-angle').innerHTML = `${data.angle}°`;
        document.getElementById('spaceship-turnto').innerHTML = `${data.turnTo}°`;

        document.getElementById('spaceship-turret-angle').innerHTML = `${data.turretAngle}°`;
        document.getElementById('spaceship-turret-turnto').innerHTML = `${data.turretTurnTo}°`;

        document.getElementById('spaceship-turret-reloading').innerHTML = `${data.reloading ? 'Yes' : 'False' }`;
        document.getElementById('spaceship-turret-reloaded').innerHTML = `${data.reloaded ? 'Yes' : 'False' }`;

        document.getElementById('spaceship-system-power').innerHTML = `${Math.round(data.systemPower * 100)}%`;
        document.getElementById('spaceship-shield-power').innerHTML = `${Math.round(data.shieldPower * 100)}%`;
        document.getElementById('spaceship-thruster-power').innerHTML = `${Math.round(data.thrusterPower * 100)}%`;

        document.getElementById('spaceship-in-safe-zone').className = `${data.inSafeZone ? 'badge-ok' : 'badge-ko'}`;
        document.getElementById('spaceship-broken').className = `${data.broken ? 'badge-ok' : 'badge-ko'}`;
        document.getElementById('spaceship-reloaded').className = `${data.reloaded ? 'badge-ok' : 'badge-ko'}`;
        document.getElementById('spaceship-cargo').className = `${data.cargo ? 'badge-ok' : 'badge-ko'}`;

        drawSpaceship(data);
    };
    */
};