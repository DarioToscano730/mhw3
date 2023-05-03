const numResults = 10;

function onJson_pet(json) {
  console.log('JSON Pet ricevuto');
  console.log(json);
  const library = document.querySelector('#album-view');
  library.innerHTML = '';
  if (json.status == 400) {
	const errore = document.createElement("h1"); 
	const messaggio = document.createTextNode(json.detail); 
	errore.appendChild(messaggio); 
	library.appendChild(errore);
	return
  }
  
  const results = json.animals
  
  if(results.length == 0)
  {
	const errore = document.createElement("h1"); 
	const messaggio = document.createTextNode("Nessun risultato!"); 
	errore.appendChild(messaggio); 
	library.appendChild(errore);
  }

  for(result of results)
  {
	console.log(result);
	if(result.primary_photo_cropped != null)
	{
		const immagine = result.primary_photo_cropped.medium;
		const album = document.createElement('div');
		album.classList.add('album');
		const img = document.createElement('img');
		img.src = immagine;
		const breed = document.createElement('h2');
		breed.textContent = result.breeds.primary;
	
		img.addEventListener('click', apriModale);
 
		
		album.appendChild(img);
		album.appendChild(breed);
		
		library.appendChild(album);
	}
  }

  
}

function onJson_img(json) {
  console.log('JSON Img ricevuto');
  
  console.log(json);
  
  const library = document.querySelector('#album-view');
  library.innerHTML = '';
  const results = json.hits
  for(result of results) {
	  console.log(result+' questo e un result');
	  }

  if(results.length == 0)
  {
	const errore = document.createElement("h1"); 
	const messaggio = document.createTextNode("Nessun risultato!"); 
	errore.appendChild(messaggio); 
	library.appendChild(errore);
  }

  for(result of results)
  {
	const immagine = result.largeImageURL;

	const album = document.createElement('div');
    album.classList.add('album');
    const img = document.createElement('img');
    img.src = immagine;
	
	img.addEventListener('click', apriModale);
 
    album.appendChild(img);
   
    library.appendChild(album);
  }
}

function onJson_gif(json) {
  console.log('JSON GIF ricevuto');
  console.log(json);
  const library = document.querySelector('#album-view');
  library.innerHTML = '';
  const results = json.data
  for(result of results) {
	  console.log(result+'questo e un result');
	  }

  if(results.length == 0)
  {
	const errore = document.createElement("h1"); 
	const messaggio = document.createTextNode("Nessun risultato!"); 
	errore.appendChild(messaggio); 
	library.appendChild(errore);
  }

  for(result of results)
  {
	console.log(result);
	const immagine = result.images.downsized_medium.url;
	const album = document.createElement('div');
    album.classList.add('album');
    const img = document.createElement('img');
    img.src = immagine;
	
	img.addEventListener('click', apriModale);
 
    album.appendChild(img);
   
    library.appendChild(album);
  }
}

function onResponse(response) {
  console.log('Risposta ricevuta');
  return response.json();
}

function getToken(json)
{
	token_data = json;
	console.log(json);
}

function onTokenResponse(response) {
  return response.json();
}

function search(event)
{
	event.preventDefault();
  
	const content = document.querySelector('#content').value;
  
	if(content) {
	    const text = encodeURIComponent(content);
		console.log('Eseguo ricerca elementi riguardanti: ' + text);
  
		const tipo = document.querySelector('#tipo').value;
		console.log('Ricerco elementi di tipo: ' +tipo);
  

		if(tipo === "immagine") {
			img_request = img_api_endpoint + '?key='  + key_img + '&q=' + text + '&per_page=' + numResults;
			fetch(img_request).then(onResponse).then(onJson_img);

	
		} else if(tipo === "gif") {
			gif_request = gif_api_endpoint + '?api_key='  + key_gif + '&q=' + text + '&limit=' + numResults;
			fetch(gif_request).then(onResponse).then(onJson_gif);
		} else if(tipo === 'pet')
		{
			const status = 'adoptable'
			fetch('https://api.petfinder.com/v2/animals?type=' + text + '&status=' + status, 
			{
				headers: {
					'Authorization': token_data.token_type + ' ' + token_data.access_token,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(onResponse).then(onJson_pet);
		}
	}
	else {
		alert("Inserisci il testo per cui effettuare la ricerca");
	}
}

function apriModale(event) {
	const image = document.createElement('img');
	image.id = 'immagine_post';
	image.src = event.currentTarget.src;
	modale.appendChild(image);
	modale.classList.remove('hidden');
	document.body.classList.add('no-scroll');
}


function chiudiModale(event) {
	console.log(event);
	if(event.key === 'Escape')
	{
		console.log(modale);
		modale.classList.add('hidden');
		img = modale.querySelector('img');
		img.remove();
		document.body.classList.remove('no-scroll');
	}
}

function prevent(event) {
	event.preventDefault();
}

function onInsert(response) {
	console.log('risposta ricevuta');
	return response.text();
}

const key_gif = 'mAvCsm3x3r5UhimJjQvAbWmHVSf8Uomb';		
const key_img = '16326848-36a4d0e195bb2375d6f41ea91';		
const gif_api_endpoint = 'http://api.giphy.com/v1/gifs/search' 
const img_api_endpoint = 'https://pixabay.com/api/' 

const key_petfinder = '7enQNVqjn3UjEq6n01Y4vqEkx6rnN2dPy2gCSbORSFp1DlzXFT'
const secret_petfinder = 'ooIVyIMsx0g8KEMWO49rVwPRqPNwL9VaixniYJF6'
const pet_api_endpoint_token = 'https://api.petfinder.com/v2/oauth2/token' 
const pet_api_endpoint = 'https://api.petfinder.com/v2/animals' 

let token_data;
fetch(pet_api_endpoint_token,
{
	method: 'POST',
	body: 'grant_type=client_credentials&client_id=' + key_petfinder + '&client_secret=' + secret_petfinder,
	headers:
	{
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}
).then(onTokenResponse).then(getToken);

const form = document.querySelector('#search_content');
form.addEventListener('submit', search)

const modale = document.querySelector('#modale');
window.addEventListener('keydown', chiudiModale);



