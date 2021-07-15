const config = require('../config');
let { PythonShell } = require('python-shell');


function runPython() {
    return new Promise((resolve, reject) => {
        try {
            PythonShell.run("final-project/main.py", null, function (err, result) {
                if (err) throw err;
                console.log("finished");
                resolve(result);
            })
        } catch (err) {
            console.log("Error with python")
            reject();
        }
    })
}

async function getScore() {
    let score = await runPython();
    return score;
}

module.exports = {

    getScore
}