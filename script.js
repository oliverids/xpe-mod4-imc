const pesoInput = document.getElementById('peso'),
    alturaInput = document.getElementById('altura'),
    calculaButton = document.getElementById('calcular'),
    resetButton = document.getElementById('reset'),
    resultsSection = document.getElementById('results'),
    imcNumber = document.getElementById('imcNumber'),
    imcClass = document.getElementById('imcClass');

let arrayInicial = [];

function updateHistorico(array) {
    let listaHistorico = document.getElementById('listaHistorico');

    listaHistorico.innerHTML = '';

    for (let i = 0; i < array.length; i++) {
        let item = document.createElement('li');

        item.innerHTML = `
                <span class="horario">Feito às ${array[i].data.hora} de ${array[i].data.dia}/${array[i].data.mes}/${array[i].data.ano}.</span>
                <p>Peso: <strong>${array[i].peso} kg</strong></p>
                <p>Altura: <strong>${array[i].altura} m</strong></p>
                <p>IMC: <strong>${array[i].imc}</strong></p>
                <p>Classificação: <strong>${array[i].classi}</strong></p>
            `;
        listaHistorico.appendChild(item);
    }

}

let calculosListaExistente = localStorage.getItem('calculos');
calculosListaExistente ? updateHistorico(JSON.parse(calculosListaExistente)) : document.getElementById('listaHistorico').innerHTML = `<p>Não há histórico de cálculos.</p>`;

function saveLocalStorage(peso, altura, imc, classi, data) {
    let calculo = {
        peso,
        altura,
        imc,
        classi,
        data
    };

    if (localStorage.getItem('calculos')) {
        arrayInicial = JSON.parse(localStorage.getItem('calculos'));

        if (arrayInicial.length < 5) {
            arrayInicial.unshift(calculo);
            localStorage.setItem('calculos', JSON.stringify(arrayInicial));
        } else {
            arrayInicial.pop();
            arrayInicial.unshift(calculo);
            localStorage.setItem('calculos', JSON.stringify(arrayInicial));
        }

    } else {
        arrayInicial.unshift(calculo);
        localStorage.setItem('calculos', JSON.stringify(arrayInicial));
    }

    updateHistorico(arrayInicial);
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

        let dataObject = new Date(),
            hora = `${dataObject.getHours()}:${dataObject.getMinutes() < 10 ? "0" + dataObject.getMinutes() : dataObject.getMinutes()}`,
            mes = dataObject.getUTCMonth() + 1,
            dia = dataObject.getUTCDate() < 10 ? `0${dataObject.getUTCDate()}` : dataObject.getUTCDate(),
            ano = +(dataObject.getUTCFullYear().toString().slice(2, 4));

        let data = { hora, mes, dia, ano };

        saveLocalStorage(peso, altura, imc, classificacao, data);
    }
}

calculaButton.addEventListener('click', e => {
    e.preventDefault();
    calculaIMC(pesoInput.value, alturaInput.value);
    setTimeout(() => pesoInput.value = alturaInput.value = '', 20);
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

    if (historySection.classList.contains('ativo')) {
        showHistorico.innerText = 'Esconder histórico de cálculos';
    } else {
        showHistorico.innerText = 'Mostrar histórico de cálculos';
    }
});
