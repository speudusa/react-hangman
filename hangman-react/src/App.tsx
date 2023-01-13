import {useCallback, useEffect, useState} from "react"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import words from "./wordlist.json"

//project source: https://www.youtube.com/watch?v=-ONUyenGnWw
//https://github.com/WebDevSimplified/react-hangman

//to run the project: npm run dev
//to quit project: q

function getWord(){
  //This returns a random word by selecting a random number between 0 and the length of the list rounded down
  return words[Math.floor(Math.random() * words.length)]
  }


function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord)
  //create an array to track guessed letters
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const inCorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.includes(letter)
    )

    //we have 6 body parts so you really only get 6 guesses total
const isLoser = inCorrectLetters.length >= 6
const isWinner = wordToGuess
                .split("")
                 .every(letter => guessedLetters
                    .includes(letter)) 

const addGuessedLetter = useCallback(
  (letter:string) => {
  if(guessedLetters.includes(letter) || isLoser || isWinner) 
  return

  setGuessedLetters(currentLetters => [...currentLetters, letter])
}, 
//dependencey 
[guessedLetters, isWinner, isLoser])


useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const key = e.key
    //if don't guess letter from a-z reset
    if(!key.match(/^[a-z]$/)) return

    //if letter is valid, pass to addGuessedLetter function
    e.preventDefault()
    addGuessedLetter(key)
  }
  document.addEventListener("keypress", handler)
  return () => {
    //cleaning up our event listener
    document.removeEventListener("keypress", handler)
  }
}, [guessedLetters])

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const key = e.key
    //if don't guess letter from a-z reset
    if(key !== "Enter") return
    e.preventDefault()
    setGuessedLetters([])
    setWordToGuess(getWord())

  }
  document.addEventListener("keypress", handler)
  return () => {
    //cleaning up our event listener
    document.removeEventListener("keypress", handler)
  }
}, [])


  return <div 
    style ={{
      maxWidth: "880px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: " 0 auto",
      alignItems: "center"
  }}
  >
    <div style={{fontSize: "2rem", textAlign: "center"}}>
    {isWinner && "Winner! Refresh to try again!"}
    {isLoser && "Nice Try. Refresh to try again!"}
    </div>
    {/* components: */}
    <HangmanDrawing numberofGuesses={inCorrectLetters.length}/>
    
    <HangmanWord 
      reveal={isLoser}
      guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
    <div style={{alignSelf: "stretch"}}>
    
    <Keyboard 
      disabled={isWinner || isLoser}
      activeLetters={
        guessedLetters.filter(letter => wordToGuess.includes(letter))
      } 
      inactiveLetters={inCorrectLetters}
      addGuessedLetter={addGuessedLetter}
    />
    </div>
  </div>
}

export default App
