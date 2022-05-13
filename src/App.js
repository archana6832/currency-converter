import React, { useEffect, useState } from 'react';
import Currency from './Currency';
import './App.css';

const BASE_URL = 'https://open.er-api.com/v6/latest';


function App() {

  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);


  let toAmount, fromAmount

  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate || 0
  }
  else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }


  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[1]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base_code)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base= ${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }

  }, [fromCurrency, toCurrency]);



  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <div className="App">
      <div className="heading">
        <h1>Currency converter</h1>

        <div className="exchange">Exchange Rate = {exchangeRate}</div>
        <Currency
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={e => setFromCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />



        <Currency
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={e => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />

      </div>
    </div >
  );
}

export default App;