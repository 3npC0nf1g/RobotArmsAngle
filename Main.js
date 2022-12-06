const input = require('sync-input');
const robot = {shortArm: 25, longArm: 40}


class Target {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Move {
    alphaLongArm;
    alphaShortArm;

    constructor(alphaLongArm, alphaShortArm) {
        this.alphaLongArm = alphaLongArm;
        this.alphaShortArm = alphaShortArm;
    }
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 *@return {Move}
 * @param {Target} target
 */
function goTo(target) {
    let cosAlphaShortArm = (Math.pow(target.x, 2) + Math.pow(target.y, 2) - Math.pow(robot.longArm, 2) - Math.pow(robot.shortArm, 2));
    cosAlphaShortArm /= 2 * robot.longArm * robot.shortArm;

    if (!(-1 <= cosAlphaShortArm && cosAlphaShortArm <= 1)) {
        throw new Error("Robot : Error");
    }

    let alphaShortArm = radiansToDegrees(Math.acos(cosAlphaShortArm));

    if (!(0 <= alphaShortArm && alphaShortArm <= 160)) {
        throw new Error("Robot : Error");
    }


    let a, b, c;
    if (target.x < 0 && target.y < 0) {
        a = 40 - 25 * cosAlphaShortArm;
        b = 25 * Math.sin(degreesToRadians(alphaShortArm));
        c = target.x;
    } else {
        a = 40 + 25 * cosAlphaShortArm;
        b = -25 * Math.sin(degreesToRadians(alphaShortArm));
        c = target.x;
    }
    if (0 === a) {
        throw new Error("Robot : Error");

    }

    let phi = Math.atan(b / a), alphaLongArm1 = radiansToDegrees(Math.acos((c * Math.cos(phi)) / a) + phi),
        alphaLongArm2 = radiansToDegrees(phi - Math.acos((c * Math.cos(phi)) / a)), alphaLongArm;


    if ((0 <= alphaLongArm1 && alphaLongArm1 <= 200)) {
        alphaLongArm = alphaLongArm1;
    } else if ((0 <= alphaLongArm2 && alphaLongArm2 <= 200)) {
        alphaLongArm = alphaLongArm2;
    } else {
        throw new Error("Robot : Error");
    }

    return new Move(alphaLongArm, alphaShortArm);

}
console.log("EXAMEN DE ROBOTIQUE DE JUIN 2022");

console.log("Veuillez entrer la coordonnée en abscisse du point C :");
let absc = input();
console.log("Veuillez entrer la coordonnée en ordonnée du point C :");
let ord = input();
const positionOfTheCPoint ={abscissa:absc, ordered: ord};

let t1 = new Target(positionOfTheCPoint.abscissa,positionOfTheCPoint.ordered);

try {
  const move =  goTo(t1);
    console.log("Calculons en degree la valeur des angles de déplacement de nos bras");
    console.log(`Le bras long se déplace de : ${move.alphaLongArm.toFixed(2)} Degrees`)
  console.log(`Le bras court se déplace de : ${move.alphaShortArm.toFixed(2)} Degrees`)
}
catch (exception){
    console.error("Point inaccessible il est hors de la portée de notre Robot!!! ");
}

