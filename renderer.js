// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

let _num1 = 0;
let _num2 = null;
let _selectedOperation = null;
let info = null;


 
const { ConnectionBuilder } = require('electron-cgi');

let _connection = null;

function setupConnectionToRestartOnConnectionLost() {
    _connection = new ConnectionBuilder().connectTo('dotnet', 'run', '--project', 'CSHARP').build();
    _connection.onDisconnect = () => {
        alert('Connection lost, restarting...');
        setupConnectionToRestartOnConnectionLost();
    };
}

setupConnectionToRestartOnConnectionLost();
getInfo();


//Loading screen testing

window.onload = function () {
    setTimeout(function () {
        document.querySelector(".loading-screen").style.display = "none";
    }, 2000);
};

function reset() {
    _num1 = 0;
    _num2 = null;
    _selectedOperation = null;
    updateDisplay();
}

function setDisplayOperation(operation) {
    document.getElementById('operation').innerText = operation || '';
}

function setDisplay(number) {
    document.getElementById('result').innerText = number;
}

function updateDisplay() {
    setDisplayOperation(_selectedOperation);
    if (_num2 === null) {
        setDisplay(_num1);
    } else {
        setDisplay(_num2);
    }
}

document.getElementById('calculator').addEventListener('click', function (e) {
    const elementClicked = e.target;
    const op = elementClicked.getAttribute('data-operation');
    const selectedNumberAsString = elementClicked.getAttribute('data-value')
    const info = elementClicked.getAttribute('board');

    if (info != null) {
        getInfo();
    }

    if (op != null) {
        if (op === 'clear') {
            reset();
        } else if (op === '=') {
            if (!_selectedOperation) {
                return;
            }
            if (_selectedOperation === '+') {
                performSum();
            } else if (_selectedOperation === '-') {
                performSubtraction();
            } else if (_selectedOperation === '*') {
                performMultiplication();
            } else {
                performDivision();
            }
        } else {
            _selectedOperation = op;
            _num2 = 0;
            updateDisplay();
        }
    } else if (selectedNumberAsString !== null) {
        const selectedNumber = Number(selectedNumberAsString);
        if (_num2 === null) {
            _num1 = _num1 * 10 + selectedNumber;
        } else {
            _num2 = _num2 * 10 + selectedNumber;
        }
        updateDisplay();
    }
});


function getInfo() {
    _connection.send('info', info, result => {
        let length = result.length;
        let msg = "";
        //alert(result);
        for (let i = 0; i < length; i++){
            msg+=result[i] + "\r\n" + "\r\n";

        }
        //reset();
        setDisplay(msg);
    });
}


function performSum() {
    _connection.send('sum', { num1: _num1, num2: _num2 }, result => {
        reset();
        _num1 = result;
        updateDisplay();
    });
}

function performSubtraction() {
    _connection.send('subtraction', { num1: _num1, num2: _num2 }, result => {
        reset();
        _num1 = result;
        updateDisplay();
    });
}

function performMultiplication() {
    _connection.send('multiplication', { num1: _num1, num2: _num2 }, result => {
        reset();
        _num1 = result;
        updateDisplay();
    });
}


function performDivision() {
    _connection.send('division', { num1: _num1, num2: _num2 }, result => {
        reset();
        alert("test");
        _num1 = result;
        updateDisplay();
    });
}
