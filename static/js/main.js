const makePause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const toArray = (string) => string.split("");

class Cursor {
    constructor(symbol, element) {
        this.element = element;
        this.element.innerText = symbol;
        this.position = 0;
        this.positionDisplacer = [];
    }

    getElement() {
        return this.element;
    }

    getPosition() {
        return this.position;
    }

    cursorVisibility(cursorBool) {
        const cursorVisible = cursorBool ? "block": "none";
        const cursor = this.getElement();
        cursor.style.display = cursorVisible;
    }

    changePositionBy(increment) {
        if (increment < 1) {
            return null;
        }
        this.position += increment;
        for (let i = 0; i < increment; i++) {
            const top = document.getElementById("top");
            const br = document.createElement("br");
            top.appendChild(br);
            this.positionDisplacer.push(br);
        }
    } 

    clearPositionDisplacement() {
        this.positionDisplacer.forEach((element) => {
            element.remove();
        })
    }
}

class Terminal {
    constructor(element) {
        this.element = element;
        this.display = [];
        this.children = [];
        this.currentChild = undefined;
        this.canType = false;
    }

    getElement() {
        return this.element;
    }

    // time per letter, text
    // this will race condition or something if you dont await it
    async addTextSlow(ms, text, sameline=false) {
        const splitText = text.split("\n");
        for (const line of splitText) {
            const element = sameline ? this.currentChild : document.createElement("p");
            this.currentChild = element;
            this.element.appendChild(this.currentChild);
            const lineCharArray = toArray(line);
            console.log(lineCharArray);
            for (const letter of lineCharArray) {
                await makePause(ms);
                this.currentChild.innerHTML += letter;
            }
        }
    }
}

// sequence to imitate boot up on dos machine
window.addEventListener("load", async () => {
    const blinkInterval = 400;
    const terminalElement = document.getElementById("terminal");
    const terminal = new Terminal(terminalElement);
    const cursorElement = document.createElement("p");
    cursorElement.id = "cursor";
    const cursor = new Cursor("_", cursorElement);
    terminal.element.appendChild(cursor.element);
    for (let i = 0; i < 5; i++) {
        cursor.cursorVisibility(0);
        await makePause(blinkInterval);
        cursor.cursorVisibility(1);
        await makePause(blinkInterval);
    }
    cursor.changePositionBy(1);
    await makePause(300);
    cursor.changePositionBy(1);
    await makePause(300);
    cursor.cursorVisibility(0);
    cursor.clearPositionDisplacement();
    await terminal.addTextSlow(100, "shr4pnelOS booting")
    await terminal.addTextSlow(500, "...", true);
});