// This is file is loaded by index.hbs and contains the logic on client-side
// Here we intend to issue a request to the server with fetch to get the weather data

console.log('Client-side javascript file is loaded!');



const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = search.value;

    messageOne.textContent = 'Loading message...';
    messageTwo.textContent = '';

    fetch(`/weather?address=${location}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                return messageOne.textContent = data.error;
            }
            messageOne.textContent = data.location;
            messageTwo.textContent = data.forecast;
        });
    });
});