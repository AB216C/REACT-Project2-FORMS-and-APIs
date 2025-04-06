import React, {useState} from 'react'

function QuestionairePage(){

  const [userInput, setUserInput] = useState({
    firstName:'', category:'', difficulty:''
  });

  const [questions,setQuestions] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorReport, setErrorReport] = useState('');
  const [answersChoice, setAnswersChoice] = useState('');
  const [isSubmitted,setIsSubmitted] = useState(false);

  //List of categories and difficulties levels that are supported by API

  const categories = [
    {name:"General Knowledge", value:9},
    {name:"Entertainment:Film", value:11},
    {name:"Science:Computers", value: 18},
    {name: "Geography", value:22}
  ];

  const difficulties = ["hard", "medium", "easy"]

  //Handling API calls and form submissions using FUnctions

  const handleSubmitForm = async(event) => {
    event.preventDefault();

  //Checking if the user is filling all fields

  if(!userInput.firstName || !userInput.category || !userInput.difficulty) {
    setErrorReport("It is required to complete all fields");
    return;
  }

  setErrorReport('')
  setIsSubmitted(true)

  //Fetching questions from trivia API

  try {

    const response = await fetch(`https://opentdb.com/api.php?amount=1&type=multiple&category=${userInput.category}&difficulty=${userInput.difficulty}`)

    const  data = await response.json()

    if(data.results&&data.results.length>0) {
      setQuestions(data.results[0]);
      setIsError(false);
    }else {
      setIsError(true)
      setErrorReport("Error occurred, unable to fetch questions data")
    }

  }catch(error) {
    setIsError(true);
    setErrorReport("Error occured, unable to fetch questions data")
  }

  };

  //Handling answer selections

  const handleAnswerChange = (event) => {
    setAnswersChoice(event.target.value);
  }

  //Handling display results and answer submissions

  const handleSubmitAnswer = () => {
    if(!answersChoice) {
      setErrorReport("Please, choise an answer");
      return;
    }
    setErrorReport('');

    const isCorrect= answersChoice === questions.correct_answer;
    setIsSubmitted(false);
    setQuestions({
      ...questions,isCorrect,answersChoice

    });

  }

   //Handling a form reset and start over

   const handleRestart = () => {
    setUserInput({
      firstName: '',
      category: '', 
      difficulty: ''
    });

    setIsSubmitted(false);
    setQuestions(null);
    setAnswersChoice('')
    setIsError(false);
    setErrorReport('');
  };

  return (
    <div className = "trivia">

      {/*This is user input form required to fill up*/}

      {!isSubmitted&&!questions && (
        <form onSubmit={handleSubmitForm} >
          <label>
            First Name:
            <input placeholder="Enter your first name" type="text" value={userInput.firstName} 
            onChange = {(event)=> setUserInput({...userInput, firstName:event.target.value})}required
            />
          </label>

          <br/>

          <label>
            Category:
            <select
            value={userInput.category}
            onChange={(event)=>setUserInput({...userInput,category:event.target.value})} required
            >
              <option value="" > Select Category </option>
              {categories.map((category)=>(
                <option key={category.value} value={category.value} >{category.name} </option>
              ))}

            </select>
          </label>

          <br/>

          <label>
            Difficulty:
            <select
            value = {userInput.difficulty}
            onChange = {(event)=> setUserInput({...userInput,difficulty:event.target.value})}required
            >

              <option value=""> Select Difficulty</option>
              {difficulties.map((difficulty,index)=>(
                <option key={index}  value={difficulty} >{difficulty} </option>
              ))}

            </select>
          </label>

          <br/>

          <button type="submit" >Retrieve a Question</button>
          {errorReport && <div className="errorReport" >{errorReport} </div> }

        </form>
      )}

      {/*Displaying questions and answers choice*/}

      {questions && !questions.isCorrect && (
        <div className="overall" >
          <p>{questions.question} </p>
          <div className="answers" >
            {
              questions.incorrect_answers 
              .concat(questions.correct_answer)
              .map((answer,index)=> (
                <label key={index} >

                  <input type="radio" name="answer" value={answer}  onChange={handleAnswerChange} />
                  {answer}

                </label>

              ))}
          </div>
          <button onClick={handleSubmitAnswer} class="submit-answer" >Submit Your Answer</button>
          {errorReport&& <div className="errorReport" >{errorReport} </div> }
        </div>
      )}

      {/*Showing the results */}
      {questions&&questions.isCorrect !== undefined && (
        <div>
          <p >{userInput.firstName}, You {questions.isCorrect? "answered correctly":"answered incorrectly" } !</p>
          {!questions.isCorrect&& <p>This was the correct answer:{questions.correct_answer} </p> }
          <button onClick={handleRestart} > Get Another Question </button>
        </div>
      )}
    </div>
  )
}

export default QuestionairePage