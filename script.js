const pesoInput = document.getElementById('peso'),
    alturaInput = document.getElementById('altura'),
    calculaButton = document.getElementById('calcular'),
    resetButton = document.getElementById('reset'),
    resultsSection = document.getElementById('results'),
    imcNumber = document.getElementById('imcNumber'),
    imcClass = document.getElementById('imcClass');

let array = [];

function updateHistorico(array) {
    let listaHistorico = document.getElementById('listaHistorico');

    listaHistorico.innerHTML = '';

    for (let i = 0; i < array.length; i++) {
        let item = document.createElement('li');

        item.innerHTML = `
            <p><strong>Peso:</strong> ${array[i].peso}</p>
            <p><strong>Altura:</strong> ${array[i].altura}</p>
            <p><strong>IMC:</strong> ${array[i].imc}</p>
            <p><strong>Classificação:</strong> ${array[i].classi}</p>
        `;
        listaHistorico.appendChild(item);
    }
}
updateHistorico(JSON.parse(localStorage.getItem('calculos')));

function saveLocalStorage(peso, altura, imc, classi) {
    let calculo = {
        peso,
        altura,
        imc,
        classi
    };

    array = JSON.parse(localStorage.getItem('calculos'));

    if (localStorage.getItem('calculos') !== null) {
        if (array.length < 5) {
            array.push(calculo);
            localStorage.setItem('calculos', JSON.stringify(array));
        } else {
            array.shift();
            array.push(calculo);
            localStorage.setItem('calculos', JSON.stringify(array));
        }

    } else {
        array.push(calculo);
        localStorage.setItem('calculos', JSON.stringify(array));
    }

    updateHistorico(array);
}

function calculaIMC(peso, altura) {
    if (peso && altura) {
        let imc = (peso / (altura * altura)).toFixed(2)
        imcNumber.innerText = imc;

        let classificacao;

        switch (true) {
            case (imc < 18.5):
                imcClass.innerText = classificacao = 'Magreza';
                break;
            case (18.5 < imc < 24.9):
                imcClass.innerText = classificacao = 'Normal';
                break;
            case (25 < imc < 29.9):
                imcClass.innerText = classificacao = 'Sobrepeso';
                break;
            case (30 < imc < 39.9):
                imcClass.innerText = classificacao = 'Obesidade';
                break;
            case (imc > 40):
                imcClass.innerText = classificacao = 'Obesidade grave';
                break;
            default:
                break;
        }

        resultsSection.classList.add('ativo');

        saveLocalStorage(peso, altura, imc, classificacao);
    }
}

calculaButton.addEventListener('click', e => {
    e.preventDefault();
    calculaIMC(pesoInput.value, alturaInput.value);
})

resetButton.addEventListener('click', e => {
    e.preventDefault();
    [pesoInput, alturaInput].forEach(each => each.value = '');
    resultsSection.classList.remove('ativo');
})

const historySection = document.getElementById('history'),
    showHistorico = document.getElementById('showHistorico');

showHistorico.addEventListener('click', () => {
    historySection.classList.toggle('ativo');

    if(historySection.classList.contains('ativo')) {
        showHistorico.innerText = 'Esconder histórico de cálculos';
    } else {
        showHistorico.innerText = 'Mostrar histórico de cálculos';
    }
});
