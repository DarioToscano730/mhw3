function onJson(json) {
    console.log('JSON ricevuto');
    const library = document.querySelector('#album-view');
    library.innerHTML = '';
    
    const results = json.albums.items;
    let num_results = results.length;
    if(num_results > 10)
      num_results = 10;
    for(let i=0; i<num_results; i++)
    {
      const album_data = results[i]
      const title = album_data.name;
      const selected_image = album_data.images[0].url;
      const album = document.createElement('div');
      album.classList.add('album');
      const img = document.createElement('img');
      img.src = selected_image;
      const caption = document.createElement('span');
      caption.textContent = title;
      album.appendChild(img);
      album.appendChild(caption);
      library.appendChild(album);
    }
  }
  
  function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
  }
  
  function search(event)
  {
    event.preventDefault();
    const album_input = document.querySelector('#album');
    const album_value = encodeURIComponent(album_input.value);
    console.log('Eseguo ricerca: ' + album_value);
    fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponse).then(onJson);
  }
  
  function onTokenJson(json)
  {
    token = json.access_token;
  }
  
  function onTokenResponse(response)
  {
    return response.json();
  }
  
  const client_id = '65f5c28530eb4abca476c6c97dee9c6d';
  const client_secret = '52ef2de4f22849d8a13af13c3dd48830';
  let token;
  fetch("https://accounts.spotify.com/api/token",
      {
     method: "post",
     body: 'grant_type=client_credentials',
     headers:
     {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
     }
    }
  ).then(onTokenResponse).then(onTokenJson);
  const form1 = document.querySelector('#form1');
  form1.addEventListener('submit', search)