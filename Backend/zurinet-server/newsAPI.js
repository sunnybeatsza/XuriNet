// Link to article = https://www.freecodecamp.org/news/make-api-calls-in-javascript/

// 1. API Construction

// Define Inital API URL
const Inital_API_URL = "https://newsapi.org/v2/everything"

// Define API query parameter
const query = "?q=South Africa&"

// Define API Key
const Final_API_URL = "apiKey=" + process.env.NEWS_API_KEY



// 2. Make a GET request using the fetch API
export async function getNews() {
    try{
        const response = await fetch(Final_API_URL)

        // if the response from the request is not ok, throw an error
        if (!response.ok){
            throw Error("There was issue with the request")
        }

        // if the response is ok, return is as json.
        const data = await response.json()

        //for dev purposes, make sure to print it to check if response is correct.
        console.log(data)
        
        }
        //IMPORTANT = Always handles any errors throw in the code to avoid code crashes.
        catch (error) {
            console.error('Error:', error);
  }
}

