const apiBaseUrl = 'https://quote.api.fdnd.nl/v1'
const container = document.querySelector('main section div')
const selector = document.querySelector('select#authorId')
const quoteForm = document.querySelector('form#quoteForm')
const authorForm = document.querySelector('form#authorForm')

// Fetch quotes and authors and show them in the container
fetchJson(apiBaseUrl + '/quote').then(parseQuotes)
fetchJson(apiBaseUrl + '/author').then(parseAuthors)

// Hook up the buttons to show/hide the forms
document.querySelectorAll('main > button').forEach((button) => {
  button.addEventListener('click', (event) => {
    if (event.target.innerHTML.toLowerCase().substring(4) === 'quote') {
      authorForm.classList.remove('active')
      quoteForm.classList.toggle('active')
    } else if (event.target.innerHTML.toLowerCase().substring(4) === 'author') {
      quoteForm.classList.remove('active')
      authorForm.classList.toggle('active')
    }
  })
})

// Hook up controls for the quote form
quoteForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let quote = {
    authorId: Number(quoteForm.elements.authorId.value),
    tags: quoteForm.elements.tags.value,
    text: quoteForm.elements.text.value,
  }

  postJson(apiBaseUrl + '/quote', quote).then((response) => {
    container.innerHTML += renderQuote(response[0])
  })

  quoteForm.elements.tags.value = quoteForm.elements.text.value = null
  quoteForm.classList.remove('active')
})

// Hook up controls for the author form
authorForm.addEventListener('submit', (event) => {
  event.preventDefault()

  let author = {
    name: authorForm.elements.name.value,
    bio: authorForm.elements.bio.value,
    avatar: authorForm.elements.avatar.value,
  }

  postJson(apiBaseUrl + '/author', author).then((response) => {
    selector.innerHTML += renderAuthor(response[0])
  })

  authorForm.elements.name.value =
    authorForm.elements.bio.value =
    authorForm.elements.avatar.value =
      null
  authorForm.classList.remove('active')
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((body) => body.data)
    .catch((error) => error)
}

/**
 * Wraps the fetch api for post assignment and returns the response body parsed
 * through json, returns an error if it is thrown.
 * @param {*} url the api endpoint to address
 * @param {*} data the object to pass along to the api
 * @returns the json response from the api endpoint
 */
async function postJson(url, data) {
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((body) => body.data)
    .catch((error) => error)
}

/**
 * Parses the passed data stream from the quotes API and renders all quotes into
 * the HTML container which is defined in the main scope
 * @param {*} data a json object containing the quotes from the API
 */
function parseQuotes(data) {
  container.innerHTML = data
    .map((quote) => renderQuote(quote))
    .reduce((previous, current) => previous + current)
}

/**
 * Parses the passed data stream from the quotes API and renders all authors into
 * the HTML container which is defined in the main scope
 * @param {*} data a json object containing the authors from the API
 */
function parseAuthors(data) {
  selector.innerHTML = data
    .map((author) => renderAuthor(author))
    .reduce((previous, current) => previous + current)
}

/**
 * Renders a quote in to HTML elements
 * @param {*} quote the quote to be rendered
 * @returns an HTML string containing the quote
 */
function renderQuote(quote) {
  return `<blockquote>${quote.text}<cite>${quote.name}</cite></blockquote>`
}

/**
 * Renders a authors in to HTML elements
 * @param {*} author the author to be rendered
 * @returns an HTML string containing the quote
 */
function renderAuthor(author) {
  return `<option value="${author.authorId}">${author.name}</option>`
}
