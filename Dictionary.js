const searchInput = document.querySelector('.search-area');
const resultBox = document.querySelector('.result-box');

function clearPreviousData() {
    const previousResultDiv = document.querySelector('.result');
    if (previousResultDiv) {
        resultBox.removeChild(previousResultDiv);
    }
}

function fetchData() {

    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputElement.value}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResult(data);
            console.log(data);
        })
        .catch(error => {
            console.error(error);
            displayError("No Data Found");
        });
}

function displayResult(data) {
    clearPreviousData();

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    resultBox.appendChild(resultDiv);

    resultDiv.innerHTML = '';

    if (data.length === 0) {
        displayError("No results found.");
        return;
    }

    // WORD
    const word = data[0].word;
    const meanings = data[0].meanings;

    const wordHeading = document.createElement('h2');
    wordHeading.innerHTML = `<strong>Word : </strong> ${word}`;
    resultDiv.appendChild(wordHeading);

    // PART OF SPEECH
    const PartOfSpeechdiv = document.createElement('div');
    PartOfSpeechdiv.innerHTML = `<strong>Part of Speech:</strong>`
    resultDiv.appendChild(PartOfSpeechdiv);
    meanings.forEach(meaning => {
        const PartofSpeech = meaning.partOfSpeech;

        const PartofSpeechname = document.createElement('p');
        PartofSpeechname.innerHTML = `<li>${PartofSpeech}</li>`;
        PartOfSpeechdiv.appendChild(PartofSpeechname);
    });


    // SYNONYMS
    let count = 0;
    meanings.forEach(meaning => {
        const synonyms = meaning.synonyms;

        if (synonyms.length > 0) {
            const synonymsdiv = document.createElement('div');
            if (count === 0) {
                synonymsdiv.innerHTML = `<strong>Synonyms:</strong>`
                resultDiv.appendChild(synonymsdiv);
                count++;
            }

            for (let i = 0; i < synonyms.length; i++) {
                const synonymsname = document.createElement('p');
                synonymsname.innerHTML = `<li>${synonyms[i]}</li>`;
                synonymsdiv.appendChild(synonymsname);

            }
        }
    });

    // ANTONYMS
    count = 0;
    meanings.forEach(meaning => {
        const antonyms = meaning.antonyms;

        if (antonyms.length > 0) {
            const antonymsdiv = document.createElement('div');
            if (count === 0) {
                antonymsdiv.innerHTML = `<strong>Antonyms:</strong>`
                resultDiv.appendChild(antonymsdiv);
                count++;
            }

            for (let i = 0; i < antonyms.length; i++) {
                const antonymsname = document.createElement('p');
                antonymsname.innerHTML = `<li>${antonyms[i]}</li>`;
                antonymsdiv.appendChild(antonymsname);

            }
        }
    });

    // DEFINITIONS
    const definitionheading = document.createElement('div');
    definitionheading.classList.add('definition');
    definitionheading.innerHTML = `<strong>Definations:</strong>`
    resultDiv.appendChild(definitionheading);

    let i = 1;
    meanings.forEach(meaning => {
        const definitions = meaning.definitions;

        definitions.forEach(definition => {

            const definitionText = definition.definition;
            const definitionParagraph = document.createElement('p');
            definitionParagraph.innerHTML = `<strong">${i++}. </strong> ${definitionText}`;
            definitionheading.appendChild(definitionParagraph);
        });
    });

    // EXAMPLE
    let j = 1;
    meanings.forEach(meaning => {
        const definitions = meaning.definitions;

        definitions.forEach(definition => {
            const definitionText = definition.definition;
            const example = definition.example;

            if (example && j < 3) {
                const exampleParagraph = document.createElement('p');
                exampleParagraph.innerHTML = `<strong>Example ${j++} : </strong> ${example}`;
                resultDiv.appendChild(exampleParagraph);
            }
        });
    });

}

function displayError(message) {
    const resultDiv = document.querySelector('.result');
    resultDiv.innerHTML = `<p class="error">${message}</p>`;
}

searchInput.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        searchInput.addEventListener('keydown', handleSearch);
        event.preventDefault();
        fetchData();
        clearPreviousData();
    }
});


//FOR SUGGETION BOX
const inputElement = document.getElementById('search-input');
const suggestionList = document.getElementById('suggestionList');

inputElement.addEventListener('click', function () {
    suggestionList.style.display = 'block';
    clearPreviousData();
    
});

inputElement.addEventListener('input', debounce(handleInput, 300));


function handleInput() {
    const inputValue = inputElement.value.trim();

    if (inputValue === '') {
        suggestionList.style.display = 'none';
        return;
    }

    getSuggestions(inputValue)
        .then(suggestions => displaySuggestions(suggestions))
        .catch(error => console.error('Error fetching suggestions:', error));
}

function getSuggestions(query) {
    const apiUrl = `https://api.datamuse.com/sug?s=${query}`;
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function displaySuggestions(suggestions) {
    if (suggestions.length === 0) {
        suggestionList.style.display = 'none';
        return;
    }

    suggestionList.innerHTML = '';

    suggestions.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word.word;
        listItem.style.listStyleType = 'none';
        listItem.addEventListener('click', function () {
            inputElement.value = word.word;
            suggestionList.style.display = 'none';
        });
        suggestionList.appendChild(listItem);
    });

    suggestionList.style.display = 'block';
}

// CLOSE THE SUGGESTION WHEN CLICK OUTSIDE THE CONTAINER
document.addEventListener('click', function (event) {
    const isClickInside = inputElement.contains(event.target) || suggestionList.contains(event.target);
    if (!isClickInside) {
        suggestionList.style.display = 'none';
    }
});

// FUNCTION TO DEBOUNCE INPUT EVENTS
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}





