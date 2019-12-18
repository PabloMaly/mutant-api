const sequence = 4;
const approve = 2;

class DNARecognizer {
    constructor (dnaArray) {
        if (!this.validate(dnaArray)){
            throw "Debe ingresar un dna válido";
        }
        this.dnaArray = dnaArray;
        this.allowed = ["T", "G", "C", "A"];
    };

    validate(dnaArray){
        return (Array.isArray(dnaArray) && dnaArray.length && dnaArray[0].length == dnaArray.length);
    }

    setDna(dnaArray) {
        this.dnaArray = dnaArray;
    }

    getDiagonalBlocks(backwards) {
        let length = this.dnaArray.length;
        let temp;
        let returnArray = [];
        for (let k = 0; k <= 2 * (length - 1); ++k) {
            temp = [];
            for (let y = length - 1; y >= 0; --y) {
                let x = k - (backwards ? length - y : y);
                if (x >= 0 && x < length) {
                    temp.push(this.dnaArray[y][x]);
                }
            }
            if (temp.length >= sequence) {
                returnArray.push(temp.join(''));
            }
        }
        return returnArray;
    }

    vertical(arr) {
        return arr[0].split("").map((col, i) => arr.map(row => row[i])).map(row => row.join(""));
    }

    getRepeatedQty(str) {
        let lastChar ="";
        let matches = 0;
        let globalMatches = 0;
        str.split("").forEach((char) => {
            if (char !== lastChar) {
                matches = 0;
            }

            if (this.allowed.indexOf(char) !== -1) {
                lastChar = char;
                matches++;
                //Si la cantidad de matches es múltiplo de la cantidad necesaria para la secuencia, sumo uno a los matches globales.
                if (matches % sequence == 0) globalMatches++;
            }
        });

        return globalMatches;
    }

    isMutant() {
        let repeated = 0;

        // repeticiones horizontales
        this.dnaArray.forEach((str) => {
            repeated += this.getRepeatedQty(str);
        });
        if (repeated > approve) return true;

        // repeticiones verticales
        this.vertical(this.dnaArray).forEach((str) => {
            repeated += this.getRepeatedQty(str);
        });
        if (repeated > approve) return true;

        // repeticiones diagonal principal
        this.getDiagonalBlocks(this.dnaArray).forEach((str) => {
            repeated += this.getRepeatedQty(str);
        });
        if (repeated > approve) return true;

        //repeticiones diagonal invertida
        this.getDiagonalBlocks(this.dnaArray, true).forEach((str) => {
            repeated += this.getRepeatedQty(str);
        });
        
        return repeated > approve;
    }
}

module.exports = DNARecognizer;
