import React, { useState, useRef, useEffect } from 'react'
import {allowedKeys} from './Helper'
import ItemList from './itemList'
import './App.css'
import axios from 'axios'
let interval = null
const App = () => {
const inputRef = useRef(null)
const outputRef = useRef(null)
const [ duration, setDuration ] = useState(60)
const [ started, setStarted ] = useState(false)
const [ ended, setEnded ] = useState(false)
const [ index, setIndex ] = useState(0)
const [ correctIndex, setCorrectIndex ] = useState(0)
const [ errorIndex, setErrorIndex ] = useState(0)
const [ quote, setQuote ] = useState({})
const [ input, setInput ] = useState('')
const [ cpm, setCpm ] = useState(0)
const [ wpm, setWpm ] = useState(0)
const [ accuracy, setAccuracy ] = useState(0)
const [ isError, setIsError ] = useState(false)
const [ lastScore, setLastScore ] = useState('0')

const random = (array) => {
	return array[Math.floor(Math.random() * array.length)];
  };
  

useEffect(() => {
	const fetchQuotes = async () => {
	  try {
		const response = await axios.get('http://localhost:5001/api/quotes');
		const quotes = response.data;
		const newQuote = random(quotes);
		console.log("new quote:", newQuote);
		setQuote(newQuote);
		setInput(newQuote.code);
	  } catch (error) {
		console.error('Error fetching quotes:', error);
	  }
	};
  
	fetchQuotes();
  }, []);


	const handleEnd = () => {
		setEnded(true)
		setStarted(false)
		clearInterval(interval)
	}

	const setTimer = () => {
		const now = Date.now()
		const seconds = now + duration * 1000
		interval = setInterval(() => {
			const secondLeft = Math.round((seconds - Date.now()) / 1000)
			setDuration(secondLeft)
			if (secondLeft === 0) {
				handleEnd()
			}
		}, 1000)
	}


	const handleStart = () => {
		setStarted(true)
		setEnded(false)
		setInput(quote.code)
		inputRef.current.focus()
		setTimer()
	}

	const handleKeyDown = e => {
		e.preventDefault()
		const { key } = e
		const quoteText = quote.code

		if (key === quoteText.charAt(index)) {
			setIndex(index + 1)
			const currenChar = quoteText.substring(index + 1, index + quoteText.length)
			setInput(currenChar)
			setCorrectIndex(correctIndex + 1)
			setIsError(false)
      outputRef.current.innerHTML += `<span class="text-correct">${key}</span>`
		} else {
			if (allowedKeys.includes(key)) {
				setErrorIndex(errorIndex + 1)
				setIsError(true)
				outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`
			}
		}

		const timeRemains = ((60 - duration) / 60).toFixed(2)
		const _accuracy = Math.floor((index - errorIndex) / index * 100)
		const _wpm = Math.round(correctIndex / 5 / timeRemains)

		if (index > 5) {
			setAccuracy(_accuracy)
			setCpm(correctIndex)
			setWpm(_wpm)
		}

		if (index + 1 === quoteText.length || errorIndex > 50) {
			handleEnd()
		}
	}

	useEffect(
		() => {
			if (ended) localStorage.setItem('wpm', wpm)
		},
		[ ended, wpm ]
	)
	useEffect(() => {
		const storedScore = localStorage.getItem('wpm')
		if (storedScore) setLastScore(storedScore)
	}, [])

	return (
		<div className="App">
			<div className="container-fluid pt-4">
				<div className="row">
					{/* Left */}
					<div className="col-sm-6 col-md-2 order-md-0 px-5">
						<ul className="list-unstyled text-center small">
							<ItemList
								name="WPM"
								data={wpm}
								style={
									wpm > 0 && wpm < 20 ? (
										{ color: 'white', backgroundColor: '#eb4841' }
									) : wpm >= 20 && wpm < 40 ? (
										{ color: 'white', backgroundColor: '#f48847' }
									) : wpm >= 40 && wpm < 60 ? (
										{ color: 'white', backgroundColor: '#ffc84a' }
									) : wpm >= 60 && wpm < 80 ? (
										{ color: 'white', backgroundColor: '#a6c34c' }
									) : wpm >= 80 ? (
										{ color: 'white', backgroundColor: '#4ec04e' }
									) : (
										{}
									)
								}
							/>
							<ItemList name="CPM" data={cpm} />
							<ItemList name="Last Score" data={lastScore} />
						</ul>
					</div>
					{/* Body */}
					<div className="col-sm-12 col-md-8 order-md-1">
						<div className="container">
                          <div className="text-center mt-4 header">
                            <h1 className='customFont'>ProgoType</h1>
                            <p className="lead">
                              Increase your programming typing speed.
                            </p>
                          </div>
							{ended ? (
								<div className="quotes">
									<span>"{quote.code}"</span>
								</div>
							) : started ? (
								<div
									className={`text-light mono quotes pg-5 ${started ? ' active' : ''}${isError ? ' is-error': ''}`}
									tabIndex="0"
									onKeyDown={handleKeyDown}
									ref={inputRef}>
									{input}
								</div>
							) : (
								<div className="mono quotes text-muted" tabIndex="-1" ref={inputRef} onClick={handleStart}>
                  {input}
								</div>
							)}
							<div className="p-4 mt-4 bg-dark text-light rounded lead" ref={outputRef} />
                      <hr className="my-4"/>
						  </div>
					</div>
							<hr className="my-4" />

              <div className="col-sm-6 col-md-2 order-md-2 px-5">
                <ul className="list-unstyled text-center small">
                  <ItemList name="Timers" data={duration} />
                  <ItemList name="Errors" data={errorIndex} />
                  <ItemList name="Acuracy" data={accuracy} symbol="%" />
                </ul>
              </div>
            </div>

                              <footer className="small text-muted pt-5 pb-2 footer">
                                <div className="footer-info text-center">
                                  <ul className="list-inline m-1">
                                    <li className="list-inline-item">v1.0.0</li>
                                    <li className="list-inline-item"> - </li>
                                    <li className="list-inline-item">
                                      <a
                                        href="https://github.com/MohamedAl-Nassirat/ProgoType"
                                        target="_blank"
                                        title="GitHub"
                                        rel="noopener noreferrer"
                                      >
                                        GitHub
                                      </a>

                                    </li>
                                  </ul>
                                  <div>
                                        This project was built for hackED Beta 2022 Hackathon.
                                  </div>
                                  <div className="copyright">
                                    Designed and built by {' '}
                                    <a href="https://www.linkedin.com/in/mohamed-al-nassirat-6893b9203/" title="GK STYLE">
                                      Mohamed Al-Nassirat
                                    </a>
                                  </div>
                                </div>
                              </footer>
			</div>
		</div>
	)
}

export default App