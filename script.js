const APIURL = 'https://api.github.com/users/';
const form = document.getElementById('form')
const inputSearch = document.getElementById('search')
const avatar = document.getElementsByClassName('avatar')
const main = document.getElementById('main')

//USAMOS LA LIBRERIA AXIOS EN VEZ DE FETCH (MUCHO MAS SIMPLE DE UTILIZAR)
async function getUser(username){
   try{
         const {data} = await axios(APIURL + username)
         //le pasamos la data a la funcion crearCard para luego usar toda la informacion del usuario
         createCardUser(data)
         getRepos(username)
   }
   catch(err){
       // usamos la funcion de error por si no encuentra el usuario
       createErrorCard('No profile with this username')
   }
}
/*
o tambien podria utilizarse de esta forma :
function getUser(username){
    axios(APIURL + username)
    .then(res => console.log(res.data))
    .catch(err => console.log('ocurrio un error' + err))
}

getUser('sclerici')
*/

// EVENTO DEL FORMULARIO
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = inputSearch.value;
    //si existe  la busqueda, ejecutamos la funcion getUser segun el usuario escrito en el input
    if (user){
        getUser(user)
        inputSearch.value = '';
    }
})
//TOMAR AVATAR DEL USUARIO
    function createCardUser(user){
        const cardHTML = `<div class="card">
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
        </div>
        <div class="user-info"> 
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
           
            <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li><strong>Repos</strong></li>
           </ul>

           <div id="repos">
            
           </div>
        </div>
   </div>`

        main.innerHTML = cardHTML
    }

    //crear tarjeta de error por si el usuario que buscamos no existe, donde le pasamos como parametro msg
   function createErrorCard (msg){
        const cardHTML = `
        <div class="card"><h2>${msg}</h2></div>`

       main.innerHTML = cardHTML
        
    }

    async function getRepos(username){
        try{
            const { data } = await axios(APIURL + username + '/repos')
            //le pasamos la data a la funcion crearCard para luego usar toda la informacion del usuario
            addReposToCard(data)
      }
      catch(err){
          // usamos la funcion de error por si no encuentra el usuario
          createErrorCard('Problem fetching repos')
      }
    }

    function addReposToCard(repos){
        //tomo el contenedor con ID repo
        const reposEl = document.getElementById('repos');

        //recorro los repos de los usuarios pero antes hago un recorte de solamente 10 repos para mostrar
        repos
        .slice(0,10)
        .forEach(repo => {
            const repoEl = document.createElement('a') //voy creando los anchors para los repos
            repoEl.classList.add('repos') //agrego la clase 'repos' que ya tienen el estilado
            repoEl.href = repo.html_url;
            repoEl.target = 'a_blank';
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl)
        });
    }

  