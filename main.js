const ul = document.querySelector('.list')
const inputTransactionName = document.getElementById('text')
const inputTransactionAmount = document.getElementById('amount')
const form = document.getElementById('form')
const banlanceDisplay = document.getElementById('saldo')
const incomeDisplay = document.querySelector('.receitas')
const expenseDisplay = document.querySelector('.despesas')

const localStorageTransaction = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransaction : []


const removeTransaction = ID =>{
    transactions = transactions.filter(item => item.id != ID)
    init()
    updateLocalStorage()
}

const addTransactionIntoDom = ({id, name, amount}) => {
    li = document.createElement('li')
    const CssClass = amount < 0 ? 'minus' : 'plus'
    const operator =  amount < 0 ? '-' : '+'
    const amountWithoutOperator = Math.abs(amount)

    li.classList.add(CssClass)
    li.innerHTML =`
    <p>${name}</p> <p>${operator} R$ ${amountWithoutOperator}</p> 
    <span onclick='removeTransaction(${id})' 
    class="delete-btn">x</span>
    `
    ul.appendChild(li)
}



const getExpense = transactionAmount => Math.abs(
    transactionAmount.filter(transaction => transaction < 0)
    .reduce((acumulador, transaction) => acumulador + transaction, 0))
    .toFixed(2)

const getIcome = transactionAmount => Math.abs(
    transactionAmount.filter(transaction => transaction > 0)
    .reduce((acumulador, transaction) => acumulador + transaction, 0))
    .toFixed(2)

const getTotal = transactionAmount => transactionAmount
    .reduce((acumulador, transaction) => acumulador + transaction, 0)
    .toFixed(2)

function updateBalanceVAlues (){
    const transactionAmount = transactions.map(({amount}) => amount)

    const total = getTotal(transactionAmount)
    const expense = getExpense(transactionAmount)
    const income = getIcome(transactionAmount)

    banlanceDisplay.innerHTML = `R$ ${total}`
    incomeDisplay.innerHTML =  `R$ ${income}`
    expenseDisplay.innerHTML =  `R$ ${expense}`

}


const init = () => {
    ul.innerHTML = ''
    transactions.forEach(addTransactionIntoDom)
    updateBalanceVAlues()
}
init()

const generatID = () => transactions.length + 1

const addToTransactionArray = (transactionName, transactionAmount) => {
    return transactions.push({
        id: generatID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

function cleanInput(){
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const updateLocalStorage = () =>{
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const handleFormSubmit = event => {
    event.preventDefault()
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' && transactionAmount === ""

    if(isSomeInputEmpty){
        alert('Por favor, prencha tanto o campo nome quanto o valor da transação')
        return
    }

    addToTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInput()
}

form.addEventListener('submit', handleFormSubmit)