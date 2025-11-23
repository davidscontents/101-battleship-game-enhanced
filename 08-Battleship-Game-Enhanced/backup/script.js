let searchRange = this.document.querySelectorAll(".range");
let fireControl = document.querySelector("#fire-control");
let targetCoordinations = [];
let formattedTargetCoordinations = [];
let userInput;
let hitCount = 0;
let score = 0;

function updatedCoordination(value, imgUrl) {
    let forwardOrBackward = Math.floor(Math.random() * 2);
    let randomManuever;
    let newLoc;

    if (forwardOrBackward) {
        randomManuever = Math.floor(Math.random() * targetCoordinations.length) + 1;
    } else {
        randomManuever = (Math.floor(Math.random() * targetCoordinations.length) + 1) * -1;
    }

    for (let i=0; i<targetCoordinations.length; i++) {
        if (targetCoordinations[i] === value) {
            newLoc = value + randomManuever;
            if (!targetCoordinations.includes(newLoc) && (newLoc >= 0 && newLoc <= 48)) {
                targetCoordinations[i] = newLoc;
                let messageElement = searchRange[value].querySelector("p");
                if (messageElement) {
                    messageElement.remove();
                }
                searchRange[value].querySelector("img").removeAttribute("src");
                searchRange[newLoc].querySelector("img").setAttribute("src", imgUrl);
            }
        }
    }
    formattedTargetCoordinations = [];
    return;
}

function targetCoordinationFormater(coordinations) {
    console.log(coordinations);
    let originalCordination;
    let combinedCoordination = "";
    for (let j=0; j<coordinations.length; j++) {
        let coordinationNumber = coordinations[j] % 7;
        if (coordinations[j] >= 0 && coordinations[j] <= 6) {
            originalCordination = coordinations[j];
            combinedCoordination = "a" + coordinationNumber;
        } else if (coordinations[j] > 6 && coordinations[j] <= 13) {
            originalCordination = coordinations[j];
            combinedCoordination = "b" + coordinationNumber;
        } else if (coordinations[j] > 13 && coordinations[j] <= 20) {
            originalCordination = coordinations[j];
            combinedCoordination = "c" + coordinationNumber;
        } else if (coordinations[j] > 20 && coordinations[j] <= 27) {
            originalCordination = coordinations[j];
            combinedCoordination = "d" + coordinationNumber;
        } else if (coordinations[j] > 27 && coordinations[j] <= 34) {
            originalCordination = coordinations[j];
            combinedCoordination = "e" + coordinationNumber;
        } else if (coordinations[j] > 34 && coordinations[j] <= 41) {
            originalCordination = coordinations[j];
            combinedCoordination = "f" + coordinationNumber;
        } else if (coordinations[j] > 41 && coordinations[j] <= 48) {
            originalCordination = coordinations[j];
            combinedCoordination = "g" + coordinationNumber;
        }             
        formattedTargetCoordinations.push([originalCordination, combinedCoordination]);
        console.log(formattedTargetCoordinations);
    }
}

function isHit(input) {
    for (let j=0; j<formattedTargetCoordinations.length; j++) {
        let message = document.createElement("p");
        let indexOfTarget = formattedTargetCoordinations[j][0];
        let target = searchRange[indexOfTarget];
        let targetAttr = target.querySelector("img").getAttribute("src");
        if (formattedTargetCoordinations[j][1] === input.toLowerCase()) {
            // const concealedInterval = setInterval(function() {
            //     target.querySelector("img").style.display = "none";
            // }, 2000)
            // const revealedInterval = setInterval(function() {
            //     target.querySelector("img").style.display = "inline-block";
            // }, 3000); 
            if (hitCount === 0 && targetAttr === "./images/battleship_normal.png") {
                message.innerHTML = "1st HIT!";
                target.appendChild(message);
                target.classList.add("yellowmsg");
                setTimeout(function() {
                    target.classList.remove("yellowmsg");
                    message.remove();
                }, 1000);
                target.querySelector("img").setAttribute("src", "./images/battleship_hit1.png");
                updatedCoordination(targetCoordinations[j], "./images/battleship_hit1.png");
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
                updatedCoordination(targetCoordinations[j], "./images/battleship_hit2.png");
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
                updatedCoordination(targetCoordinations[j], "./images/battleship_hit3.png");
                hitCount++;
                score += 100;
                return true;
            } else if (hitCount === 3 && targetAttr === "./images/battleship_hit3.png") {
                message.innerHTML = "DESTROYED!!!";
                target.appendChild(message);
                target.classList.add("graymsg");
                targetCoordinations.splice(j, 1);
                formattedTargetCoordinations.splice(j, 1);
                target.querySelector("img").setAttribute("src", "./images/battleship_explosion.png");
                target.querySelector("img").style.marginTop = "0";
                // clearInterval(concealedInterval);
                // clearInterval(revealedInterval);
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
    if (formattedTargetCoordinations.length === 0) {
        fireControl.querySelector("input").value = "All destroyed!!!";
        setTimeout(function() {
            fireControl.querySelector("input").value = `Score: ${score}`;
        }, 2000);
        // setTimeout(window.location.reload(), 6000);
    } else {
        if (userInput !== "" && userInput !== null && userInput !== undefined) {
            let result = isHit(userInput.trim());
            if (result) {
                targetCoordinationFormater(targetCoordinations);
            } else {
                fireControl.querySelector("input").value = "";
            }
        }
    }
});

window.onload = function() {
    let numberOfBattleships = Math.floor(Math.random() * 3) + 3;
    for (let i=0; i<numberOfBattleships; i++) {
        let random = Math.floor(Math.random() * 49);
        if (!targetCoordinations.includes(random)) {
            targetCoordinations.push(random);
            let battleshipLocation = searchRange[random];
            battleshipLocation.querySelector("img").setAttribute("src", "./images/battleship_normal.png");
        }
    }
    fireControl.querySelector("input").value = "";
    targetCoordinationFormater(targetCoordinations);
}


