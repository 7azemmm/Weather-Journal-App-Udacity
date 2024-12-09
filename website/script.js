
// Personal API Key for OpenWeatherMap API
const API_KEY =  "c4bcea71a1d36a814e37a40f84c41f4c" ;
const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";

// Convert date
function convertDate(unixtimestamp) {
	// Months array
	var months_array = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// Convert timestamp to milliseconds
	var date = new Date(unixtimestamp * 1000);

	// Year
	var year = date.getFullYear();

	// Month
	var month = months_array[date.getMonth()];

	// Day
	var day = date.getDate();

	// Display date time in MM/dd/yyyy format
	var convertedTime = month + "/" + day + "/" + year;

	return convertedTime;
}

// Event listener to add function to existing element
document.getElementById("generate").addEventListener("click", displayAction);

function displayAction() {
	const zip = document.getElementById("zipcode").value;
	const feelings = document.getElementById("feeling").value;

	getDataApi(baseURL, zip, API_KEY)
		.then(function (data) {
			// Add data
			console.log("AllData from api: ", data);
			postDataApi("http://127.0.0.1:8000/addWeatherData", {
				temperature: data.main.temp,
				date: convertDate(data.dt),
				userResponse: feelings,
			});
		})
		.then(() => updateUI());
}

// Async GET
/* Function to GET Web API Data*/
const getDataApi = async (baseURL, zip, API_KEY) => {
	if (!/^\d{5}$/.test(zip)) {
		alert("ZIP code must be exactly 5 numeric digits!");
		return;
	}
	const url = `${baseURL}${zip}&appid=${API_KEY}&units=metric`; // Added units=metric for Celsius

	try {
		const request = await fetch(url);
		const allData = await request.json();
		if (allData.cod !== 200) { // Ensure valid response from API
			alert(allData.message);
			return null;
		}
		return allData;
	} catch (error) {
		console.error("Error fetching data:", error);
		alert("An error occurred while fetching weather data.");
	}
};



/* Function to POST data */
const postDataApi = async (url = "http://127.0.0.1:8000/addWeatherData", data = {}) => {
	console.log("post weather data: ", data);
	const response = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	try {
		const newData = await response.json();
		console.log("post res: ", newData);
	} catch (error) {
		console.log("error", error);
	}
};


/* Function to update UI */
const updateUI = async () => {
	const request = await fetch("http://127.0.0.1:8000/all");
	try {
		const data = await request.json();
		console.log("updateUI: ", data);
		document.getElementById("date").innerHTML = `Date: ${data.date}`;
		document.getElementById("temp").innerHTML = `Temperature(°C): ${data.temperature}`;
		document.getElementById("content").innerHTML = `Feelings: ${data.userResponse}`;
	} catch (error) {
		console.log("error", error);
	}
};