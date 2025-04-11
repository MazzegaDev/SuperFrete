const key = 'shippingHist';
let shipping = JSON.parse(localStorage.getItem(key)) || [];
const table = document.getElementById('freteTable');

window.addEventListener('DOMContentLoaded', ()=> renderHistory());
function calc(){
    let customerName = document.getElementById('nomeCliente').value;
    let customerNum = document.getElementById('tellCliente').value;
    let km = parseInt(document.getElementById('kmPer').value);
    let oilPrice = parseFloat(document.getElementById('valorOleo').value);
    let spentOil = parseFloat(document.getElementById('oleoGasto').value);
    let toll = parseFloat(document.getElementById('pedagio').value);
    let personalSpent = parseFloat(document.getElementById('gastoParte').value);
    
    let errorDiv = document.getElementById('mensagemErro');

if(!customerName.trim() || !customerNum.trim() || isNaN(km) || isNaN(oilPrice) || isNaN(spentOil) || isNaN(toll) || isNaN(personalSpent)){
        errorDiv.innerText = 'Por favor, preencha corretamente todos os campos.'
    }else{
        let profit = calcProfit(spentOil, oilPrice, toll, km, personalSpent);
        renderTable(customerName, customerNum, km, oilPrice, spentOil, toll, table, profit, personalSpent);
    }
}

function calcProfit(spentOil, oilPrice, toll,km, personalSpent){
    const fixedNumber = 3;
    let oilPerKm = km / spentOil;
    let pricePerKm = oilPerKm * fixedNumber;
    let price = pricePerKm * oilPrice;
    let finalProfit = price - toll - personalSpent;
 
    
    return finalProfit.toFixed(2);
}

function renderTable(customerName, customerNum, km, oilPrice, spentOil, toll, table, profit,personalSpent){
    shipping.push({cName: customerName, cNum: customerNum, km: km, oilPrice: oilPrice, spentOil: spentOil, toll: toll, profit: profit, pSpent: personalSpent});
    
    let html = makeTable(shipping);
    table.innerHTML = html;
    saveToStorage();
}

function makeTable(arr){
    let html = `<tr>
                    <th class="checkbox-col">Selecionar</th>
                    <th>Nome do cliente: </th>
                    <th>Telefone do cliente: </th>
                    <th>Valor gasto com pedagio: </th>
                    <th>Valor do gasto adicional</th>
                    <th>KM percorrido: </th>
                    <th>Valor do óleo: </th>
                    <th>óleo gasto na viagem: </th>
                    <th>Lucro:</th>
                </tr>`
    for(let i of arr){
        html += `<tr>
                    <td><input type="checkbox" data-index="${i}"></td>
                    <td>${i.cName}</td>
                    <td>${i.cNum}</td>
                    <td>${i.toll}</td>
                    <td>${i.pSpent}</td>
                    <td>${i.km}</td>
                    <td>${i.oilPrice}</td>
                    <td>${i.spentOil}</td>
                    <td>R$:${i.profit}</td>
                </tr>`
    }

    return html;
}

function saveToStorage(){
    let toJSON = JSON.stringify(shipping);
    localStorage.setItem(key,toJSON);
}

function renderHistory(){
    let jsonIten = JSON.parse(localStorage.getItem(key)) || [];
    let table = document.getElementById('freteTable');

    table.innerHTML = '';
    
    let html = makeTable(jsonIten);

    table.innerHTML = html;
}

function removeSelected(){
    let selectedCustomers = document.querySelectorAll('input[type="checkbox"]:checked');
    let toRemove = [];
    selectedCustomers.forEach((checkbox, index) =>{
        if(checkbox.checked){
            toRemove.push(index);
        }
    });

    for(let index of selectedCustomers){
        shipping.splice(index, 1);
    }

    let html = reRender(shipping);
    table.innerHTML = html;

    saveToStorage();
}

function reRender(arr){
    let html = makeTable(arr);

    return html;
}