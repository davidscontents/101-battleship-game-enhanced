let searchRange = this.document.querySelectorAll(".range");
let fireControl = document.querySelector("#fire-control");
let formattedTargetCoordinations = [];
let userInput;
let hitCount = 0;
let score = 0;

function targetCoordinationFormater(coordinations) {
    let combinedCoordination = "";
    for (let j=0; j<coordinations.length; j++) {
        if (coordinations[j] >= 0 && coordinations[j] <= 6) {
            combinedCoordination = "a" + coordinations[j];
        } else if (coordinations[j] > 6 && coordinations[j] <= 13) {
            combinedCoordination = "b" + coordinations[j];
        } else if (coordinations[j] > 13 && coordinations[j] <= 20) {
            combinedCoordination = "c" + coordinations[j];
        } else if (coordinations[j] > 20 && coordinations[j] <= 27) {
            combinedCoordination = "d" + coordinations[j];
        } else if (coordinations[j] > 27 && coordinations[j] <= 34) {
            combinedCoordination = "e" + coordinations[j];
        } else if (coordinations[j] > 34 && coordinations[j] <= 41) {
            combinedCoordination = "f" + coordinations[j];
        } else if (coordinations[j] > 41 && coordinations[j] <= 48) {
            combinedCoordination = "g" + coordinations[j];
        }             
        formattedTargetCoordinations.push(combinedCoordination);
        console.log(formattedTargetCoordinations);
    }
}

function isHit(input) {
    for (let j=0; j<formattedTargetCoordinations.length; j++) {
        let message = document.createElement("p");
        let indexOfTarget = formattedTargetCoordinations[j].slice(1);
        let target = searchRange[indexOfTarget];
        let targetAttr = target.querySelector("img").getAttribute("src");
        if (formattedTargetCoordinations[j] === input.toLowerCase()) {
            target.querySelector("img").style.display = "inline-block";
            if (hitCount === 0 && targetAttr === "./images/battleship_normal.png") {
                message.innerHTML = "1st HIT!";
                target.appendChild(message);
                target.classList.add("yellowmsg");
                setTimeout(function() {
                    target.classList.remove("yellowmsg");
                    message.remove();
                }, 1000);
                target.querySelector("img").setAttribute("src", "./images/battleship_hit1.png");
                hitCount++;
                score += 100;
                return true;
            } else if (hitCount === 1 && targetAttr === "./images/battleship_hit1.png") {
                message.innerHTML = "2nd HIT!";
                target.appendChild(message);
                target.classList.add("orangemsg");
                setTimeout(function() {
                    target.classList.remove("orangemsg");
                    message.remove();
                }, 1000);
                target.querySelector("img").setAttribute("src", "./images/battleship_hit2.png");
                hitCount++;
                score += 100;
                return true;
            } else if (hitCount === 2 && targetAttr === "./images/battleship_hit2.png") {
                message.innerHTML = "3rd HIT!";
                target.appendChild(message);
                target.classList.add("redmsg");
                setTimeout(function() {
                    target.classList.remove("redmsg");
                    message.remove();
                }, 1000);
                target.querySelector("img").setAttribute("src", "./images/battleship_hit3.png");
                hitCount++;
                score += 100;
                return true;
            } else if (hitCount === 3 && targetAttr === "./images/battleship_hit3.png") {
                message.innerHTML = "DESTROYED!!!";
                target.appendChild(message);
                target.classList.add("graymsg");
                formattedTargetCoordinations.splice(j, 1);
                target.querySelector("img").setAttribute("src", "./images/battleship_explosion.png");
                target.querySelector("img").style.marginTop = "0";
                setTimeout(function() {
                    target.classList.remove("graymsg");
                    message.remove();
                    target.querySelector("img").removeAttribute("src");
                }, 2000);
                hitCount = 0;
                score += 200;
                return true;
            }
        } else {
            message.innerHTML = "MISS!"
            target.appendChild(message);
            target.classList.add("greenmsg");
            setTimeout(function() {
                target.classList.remove("greenmsg");
                message.remove();
            }, 1000);
            score -= 100;
        }
    }
    fireControl.querySelector("input").value = "";
}

fireControl.querySelector("input").addEventListener("keyup", function(e) {
    if (fireControl.querySelector("input").value !== "" && fireControl.querySelector("input").value !== null) {
        userInput = fireControl.querySelector("input").value;
    }
});

fireControl.querySelector("button").addEventListener("click", function() {
    if (userInput !== "" && userInput !== null && userInput !== undefined) {
        let result = isHit(userInput.trim());
        if (!isNaN(result)) {
            if (formattedTargetCoordinations.length === 0) {
                fireControl.querySelector("input").value = "All destroyed!!!";
                setTimeout(function() {
                    fireControl.querySelector("input").value = `Score: ${score}`;
                }, 2000);
                setTimeout(window.location.reload(), 4000);
            }
        } else {
            fireControl.querySelector("input").value = "";
        }
    }
});

window.onload = function() {
    let numberOfBattleships = Math.floor(Math.random() * 3) + 3;
    let targetCoordinations = [];
    for (let i=0; i<numberOfBattleships; i++) {
        let random = Math.floor(Math.random() * 49);
        if (!targetCoordinations.includes(random)) {
            targetCoordinations.push(random);
            let battleshipLocation = searchRange[random];
            battleshipLocation.querySelector("img").setAttribute("src", "./images/battleship_normal.png");
            this.setTimeout(function() {
                battleshipLocation.querySelector("img").style.display = "none";
            }, 2000);
        }
    }
    fireControl.querySelector("input").value = "";
    targetCoordinationFormater(targetCoordinations);
}


