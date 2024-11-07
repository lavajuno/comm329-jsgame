/**
 * @type {String[]}
 */
const ENCODINGS = {
    "A": "._",
    "B": "_...",
    "C": "_._.",
    "D": "_..",
    "E": ".",
    "F": ".._.",
    "G": "__.",
    "H": "....",
    "I": "..",
    "J": ".___",
    "K": "_._",
    "L": "._..",
    "M": "__",
    "N": "_.",
    "O": "___",
    "P": ".__.",
    "Q": "__._",
    "R": "._.",
    "S": "...",
    "T": "_",
    "U": ".._",
    "V": "..._",
    "W": ".__",
    "X": "_.._",
    "Y": "_.__",
    "Z": "__..",
    "1": ".____",
    "2": "..___",
    "3": "...__",
    "4": "...._",
    "5": ".....",
    "6": "_....",
    "7": "__...",
    "8": "___..",
    "9": "____.",
    "0": "_____"
}

/**
 * @type {String[]}
 */
const Q_CODES = [
    "QRM",
    "QRP",
    "QRQ",
    "QRS",
    "QRT",
    "QRZ",
    "QSK",
    "QSL",
    "QSO",
    "QSP",
    "QSY",
    "QTH",
    "CQ"
]

/**
 * @type {String[]}
 */
const NUM_CODES = [
    "43",
    "45",
    "55",
    "57",
    "59",
    "73"
]

/**
 * @type {String[]}
 */
const WORDS = [
    "A",
    "ABOUT",
    "ALL",
    "ALSO",
    "AND",
    "AS",
    "AT",
    "BE",
    "BECAUSE",
    "BUT",
    "BY",
    "CAN",
    "COME",
    "COULD",
    "DAY",
    "DO",
    "EVEN",
    "FIND",
    "FIRST",
    "FOR",
    "FROM",
    "GET",
    "GIVE",
    "GO",
    "HAVE",
    "HE",
    "HER",
    "HERE",
    "HIM",
    "HIS",
    "HOW",
    "I",
    "IF",
    "IN",
    "INTO",
    "IT",
    "ITS",
    "JUST",
    "KNOW",
    "LIKE",
    "LOOK",
    "MAKE",
    "MAN",
    "MANY",
    "ME",
    "MORE",
    "MY",
    "NEW",
    "NO",
    "NOT",
    "NOW",
    "OF",
    "ON",
    "ONE",
    "ONLY",
    "OR",
    "OTHER",
    "OUR",
    "OUT",
    "PEOPLE",
    "SAY",
    "SEE",
    "SHE",
    "SO",
    "SOME",
    "TAKE",
    "TELL",
    "THAN",
    "THAT",
    "THE",
    "THEIR",
    "THEM",
    "THEN",
    "THERE",
    "THESE",
    "THEY",
    "THING",
    "THINK",
    "THIS",
    "THOSE",
    "TIME",
    "TO",
    "TWO",
    "UP",
    "USE",
    "VERY",
    "WANT",
    "WAY",
    "WE",
    "WELL",
    "WHAT",
    "WHEN",
    "WHICH",
    "WHO",
    "WILL",
    "WITH",
    "WOULD",
    "YEAR",
    "YOU",
    "YOUR"
]

/**
 * @type {String}
 */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * @type {HTMLDivElement}
 */
const prompt_e = document.getElementById("prompt");

/**
 * @type {HTMLDivElement}
 */
const encoding_e = document.getElementById("encoding");

/**
 * @type {HTMLSpanElement[]}
 */
let prompt_elements = [];

/**
 * @type {HTMLSpanElement[]}
 */
let encoding_elements = [];

/**
 * @param {Number} lo Lower bound
 * @param {Number} hi Upper bound
 * @returns {Number} Some integer S.T. lo <= n < hi
 */
function randint(lo, hi) {
    return Math.floor(Math.random() * (hi - lo)) + lo;
}

class PromptGenerator {
    static #generateQCode() {
        return Q_CODES[randint(0, Q_CODES.length)];
    }

    static #generateNumCode() {
        return NUM_CODES[randint(0, NUM_CODES.length)];
    }

    static #generateWord() {
        return WORDS[randint(0, WORDS.length)];
    }

    static #generateCallsign() {
        let sizeA = randint(1, 3);
        let sizeB = randint(1, 4);
        let out = "";
        for(let i = 0; i < sizeA; i++) {
            out += CHARS[randint(0, 26)];
        }
        out += String(randint(0, 10));
        for(let i = 0; i < sizeB; i++) {
            out += CHARS[randint(0, CHARS.length)];
        }
        return out;
    }

    /**
     * @param {Number} n 
     * @returns {String}
     */
    static generateWords(n) {
        let words = "";
        for (let i = 0; i < n; i++) {
            let r = randint(0, 100);
            if (r < 15) {
                words += this.#generateQCode();
            } else if (r < 25) {
                words += this.#generateNumCode();
            } else if (r < 45) {
                words += this.#generateCallsign();
            } else {
                words += this.#generateWord();
            }
            words += " ";
        }
        return words;
    }
}

/**
 * @param {String} line 
 */
function makePrompt(line) {
    for (let e of prompt_elements) {
        e.remove();
    }
    prompt_e.innerHTML = "";

    for (let c of line) {
        if (c == " ") {
            prompt_elements[prompt_elements.length - 1].classList.add("space");
        } else {
            let e = document.createElement("span");
            e.innerHTML = c;
            prompt_elements.push(e);
            prompt_e.appendChild(e);
        }
    }
    prompt_elements[0].classList.add("active");

    makeEncoding(prompt_elements[0].textContent);
}

/**
 * @param {String} letter
 */
function makeEncoding(letter) {
    for (let e of encoding_elements) {
        e.remove();
    }
    encoding_e.innerHTML = "";

    for(let c of ENCODINGS[letter]) {
        let e = document.createElement("span");
        e.innerHTML = c;
        encoding_elements.push(e);
        encoding_e.appendChild(e);
    }
    encoding_elements[0].classList.add("active");
}

function advancePrompt() {
    prompt_elements[0].remove();
    prompt_elements.shift();
    if (prompt_elements.length > 0) {
        prompt_elements[0].classList.add("active");
        makeEncoding(prompt_elements[0].textContent);
    } else {
        makePrompt(PromptGenerator.generateWords(15));
    }
}

/**
 * 
 * @param {String} c 
 */
function advanceEncoding(c) {
    if (c == encoding_elements[0].textContent) {
        encoding_elements[0].remove();
        encoding_elements.shift();
        if (encoding_elements.length > 0) {
            encoding_elements[0].classList.add("active");
        } else {
            advancePrompt();
        }
    } else {
        encoding_elements[0].classList.add("incorrect");
    }
}

document.addEventListener("keypress", (event) => {
    switch (event.key) {
        case ".":
            advanceEncoding(".");
            let dit = new Audio("audio/dit.m4a");
            dit.play();
            break;
        case ",":
            advanceEncoding("_");
            let dah = new Audio("audio/dah.m4a");
            dah.play();
            break;
    }
});

window.addEventListener("load", () => {
    makePrompt(PromptGenerator.generateWords(15));
});
