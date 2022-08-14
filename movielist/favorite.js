const base_url = 'https://movie-list.alphacamp.io'
const index_url = base_url + '/api/v1/movies/'
const poster_url = base_url + '/posters/'
const datapanel = document.querySelector('#data-panel')
const searchform = document.querySelector('#search-form')
const searchinput = document.querySelector('#search-input')

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))



  



function movierender(data) {
  let content = ''
  data.forEach(item => {
    content += `
      <div class="col-sm-3">  
      <div class="mt-2">
        <div class="card" style="width: 18rem;">
          <img src="${poster_url + item.image}" class="card-img-top" alt="...">

          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    </div>
  </div>
      `
  });
  
    
  datapanel.innerHTML = content
}



function showmoviemodal (id){
  const modaltitle = document.querySelector('#movie-modal-title')
  const modalimage = document.querySelector('#movie-modal-img')
  const modaldate = document.querySelector('#movie-modal-date')
  const modaldescription = document.querySelector('#movie-modal-description')

  axios.get(index_url+id)
    .then(function (response) {
      const data = response.data.results
      modaltitle.innerText = data.title
      modalimage.innerHTML = `<img src="${poster_url + data.image
        }" alt="movie-poster" class="img-fluid">`
      modaldate.innerText = 'Release date:'  + data.release_date
      modaldescription.innerHTML = data.description
    })
}

function removefavorite (id){

    if (!movies || !movies.length) return
    // 一旦收藏清單是空的，或傳入的 id 在收藏清單中不存在，就結束這個函式

    
    const movieindex = movies.findIndex(function(movie){
        return movie.id === id
    })
    // findIndex 只告訴我們那個項目的 index。 若沒能找到符合的項目，則會回傳 -1
    if(movieindex === -1) return
    // 當return 執行時，解譯器會跳出該函式，所以如果return 後面還有程式碼，則不會被執行。
    movies.splice(movieindex,1)

    localStorage.setItem('favoriteMovies',JSON.stringify(movies))

    movierender(movies)
    // 沒加的話要手動F5
}


datapanel.addEventListener('click', function (event) {
  if (event.target.matches('.btn-show-movie')) {
    showmoviemodal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removefavorite(Number(event.target.dataset.id))
  }
})

movierender(movies)



