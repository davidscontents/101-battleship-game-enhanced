const searchRange = document.querySelectorAll(".range");
const fireControl = document.querySelector("#fire-control");
let currentCoordinations = [];
let formattedCoordinations = [];
let userInput = 0;
let result = -1;
let score = 0;

let updateDisplay = {
    shipImgs: ["./images/battleship_normal.png",
                "./images/battleship_hit1.png",
                "./images/battleship_hit2.png",
                "./images/battleship_hit3.png",
                "./images/battleship_explosion.png"],

    messages: ["Miss!", "1st Hit!", "2nd Hit!", "3rd Hit!", "Destroyed!!", "All's sunk!!!"],
    msgColors: ["greenmsg", "yellowmsg", "orangemsg", "redmsg", "graymsg"],
    newElement: document.createElement("p"),

    shipupdate(targetElement, infoToShow) {
        targetElement.querySelector("img").setAttribute("src", this.shipImgs[infoToShow]);
    },
    shipmaneuver(currentCoordinations, formattedCoordinations, targetElement, targetIdx, infoToShow, result) {
        targetElement.querySelector("img").removeAttribute("src");
        let moveDirection = Math.floor(Math.random() * 2);
        let numberOfMoves = targetIdx;
        let newFormatted;
        while (currentCoordinations.includes(numberOfMoves)) {
            let forward = Math.floor(Math.random() * currentCoordinations.length);
            let backward = Math.floor(Math.random() * currentCoordinations.length) * -1;
            if (moveDirection) {
                if ((targetIdx + forward) <= 48) {
                    numberOfMoves = targetIdx + forward;
                    targetElement = searchRange[numberOfMoves];
                } else {
                    numberOfMoves = targetIdx + backward;
                    targetElement = searchRange[numberOfMoves];
                }
            } else {
                if ((targetIdx + backward) >= 0) {
                    numberOfMoves = targetIdx + backward;
                    targetElement = searchRange[numberOfMoves];
                } else {
                    numberOfMoves = targetIdx + forward;
                    targetElement = searchRange[numberOfMoves];
                }            
            }
        }
        currentCoordinations[result] = numberOfMoves;
        newFormatted = convertCoordination.convert(numberOfMoves, numberOfMoves%7);
        formattedCoordinations[result][0] = newFormatted;
        console.log("Moved: ", currentCoordinations, formattedCoordinations);
        this.shipupdate(targetElement, infoToShow);
        return targetElement;
    },
    shipremove(targetElement, result) {
        setTimeout(function() {
            targetElement.querySelector("img").removeAttribute("src");
        }, 2000);
        currentCoordinations.splice(result, 1);
        formattedCoordinations.splice(result, 1); 
    },
    messageupdate(targetElement, infoToShow) {
        this.newElement.innerHTML = this.messages[infoToShow];
        targetElement.appendChild(this.newElement);
        targetElement.querySelector("p").classList.add(this.msgColors[infoToShow]);
        setTimeout(function() {
            if (targetElement.querySelector("p")) {
                targetElement.querySelector("p").removeAttribute("class");
                targetElement.querySelector("p").remove();
            }
        }, 1000);
        fireControl.querySelector("input").value = "";
    },
    score(point) {
        score = score + point;
        console.log("Current score: ", score);
    },
    reloadPage() {
        window.location.reload();
    },
    reverseconvert(userInput) {
        let letter = userInput.slice(0, 1);
        let number = Number(userInput.slice(1));
        switch (letter) {
            case "a":
                return number;
            case "b":
                return 7 + number;
            case "c":
                return 14 + number;
            case "d":
                return 21 + number;
            case "e":
                return 28 + number;
            case "f":
                return 35 + number;
            case "g":
                return 42 + number;
            default:
                console.log("error");
        }
    }
}

let convertCoordination = {
    formatted: "",
    convert(random, columnNumber) {
        if (random >= 0 && random <= 6) {
            this.formatted = "a" + columnNumber;
        } else if (random > 6 && random <= 13) {
            this.formatted = "b" + columnNumber;
        } else if (random > 13 && random <= 20) {
            this.formatted = "c" + columnNumber;
        } else if (random > 20 && random <= 27) {
            this.formatted = "d" + columnNumber;
        } else if (random > 27 && random <= 34) {
            this.formatted = "e" + columnNumber;
        } else if (random > 34 && random <= 41) {
            this.formatted = "f" + columnNumber;
        } else if (random > 41 && random <= 48) {
            this.formatted = "g" + columnNumber;
        }
        return this.formatted;
    }
}

function displayScenes(currentCoordinations, formattedCoordinations, result) {
    let targetIdx;
    let targetElement;
    let infoToShow;
    console.log("Display(index): ", result);
    if (result >= 0 && (formattedCoordinations[result][1] >= 0 && formattedCoordinations[result][1] <= 4)) {
        targetIdx = currentCoordinations[result];
        targetElement = searchRange[targetIdx];
        infoToShow = formattedCoordinations[result][1];
        updateDisplay.shipupdate(targetElement, infoToShow);
        if (formattedCoordinations[result][1] > 0 && formattedCoordinations[result][1] < 4) {
            targetElement = updateDisplay.shipmaneuver(currentCoordinations, formattedCoordinations, targetElement, targetIdx, infoToShow, result);
        }
        updateDisplay.messageupdate(targetElement, infoToShow);
        if (updateDisplay.shipImgs[infoToShow] === updateDisplay.shipImgs[4]) {
            updateDisplay.shipremove(targetElement, result);
            if (currentCoordinations.length === 0 && formattedCoordinations.length === 0) {
                fireControl.querySelector("input").value = updateDisplay.messages[5];
                setTimeout(function() {
                    fireControl.querySelector("input").value = `Score: ${score}`;
                }, 2000);    
                setTimeout(updateDisplay.reloadPage, 4000);
            }
        }
        console.log("After-currentCoordinations: ", currentCoordinations, "After-formattedCoordinations: ", formattedCoordinations);
    } else if (typeof result === "string") {
        let reversed = updateDisplay.reverseconvert(result);
        targetElement = searchRange[reversed];
        infoToShow = 0;
        updateDisplay.messageupdate(targetElement, infoToShow);
    } else {
        for (let i=0; i<formattedCoordinations.length; i++) {
            targetIdx = currentCoordinations[i];
            targetElement = searchRange[targetIdx];
            infoToShow = formattedCoordinations[i][1];
            updateDisplay.shipupdate(targetElement, infoToShow);
            fireControl.querySelector("input").value = "";
        }
    }
}

function buildModels() {
    let numberOfShips = Math.floor(Math.random() * 3) + 3;
    let damageLevel = 0;

    for (let i=0; i<numberOfShips; i++) {
        let random = Math.floor(Math.random() * 49);
        let columnNumber = random % 7;
        let converted;
        if (!currentCoordinations.includes(random)) {
            currentCoordinations.push(random);
            converted = convertCoordination.convert(random, columnNumber);
            formattedCoordinations.push([converted, damageLevel]);
        }
    }
    console.log("Initial Value: ", currentCoordinations, formattedCoordinations);
}

function fireSystemControl(userInput) {
    for (let j=0; j<formattedCoordinations.length; j++) {
        if (formattedCoordinations[j][0] === userInput.toLowerCase()) {
            if (formattedCoordinations[j][1] >= 0 && formattedCoordinations[j][1] < 4) {
                formattedCoordinations[j][1] = formattedCoordinations[j][1] + 1;
                console.log("check damage: ", formattedCoordinations[j]);
                return j;
            }
        }
    }
    return userInput;
}

fireControl.querySelector("input").addEventListener("keyup", function(e) {
    if (fireControl.querySelector("input").value !== "" && fireControl.querySelector("input").value !== null) {
        userInput = fireControl.querySelector("input").value;
    }
});

fireControl.querySelector("button").addEventListener("click", function() {
    if (userInput !== "" && userInput !== null && userInput !== undefined) {
        result = fireSystemControl(userInput.trim());
        console.log("userInput: ", userInput, "result(index): ", result);
        if (result === userInput) {
            result = 0;
            updateDisplay.score(-100);
            result = userInput;
        } else {
            if (formattedCoordinations[result][1] === 4) {
                updateDisplay.score(200);
            } else {
                updateDisplay.score(100);
            }
        }
        displayScenes(currentCoordinations, formattedCoordinations, result);
    } else {
        console.log("Invalid Target!");
    }
});

window.onload = function() {
    buildModels();
    displayScenes(currentCoordinations, formattedCoordinations, result);
}


