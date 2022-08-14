const base_url = 'https://movie-list.alphacamp.io'
const index_url = base_url + '/api/v1/movies/'
const poster_url = base_url + '/posters/'
const datapanel = document.querySelector('#data-panel')
const searchform = document.querySelector('#search-form')
const searchinput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const moviespage = 12
const movies = []
let filteredMovies = []


  

axios.get(index_url)
  .then(function (response) {
      movies.push(...response.data.results)
      paginatorrender(movies.length)
      movierender(getmoviespage(1))
      
  })

function getmoviespage (page){
  // page 1 -> 0-11
  // page 2 -> 12-23
  // page 3 -> 24-35
  // ...
  const data = filteredMovies?filteredMovies : movies
  // 如果搜尋清單有東西，就取搜尋清單 filteredMovies，否則就還是取總清單 movies
  const startindex = (page -1) * moviespage
  // slice (0,12) 只會取0-11 不會取最後 回傳第1-12部到movies
  return data.slice( startindex, startindex + moviespage )
}

function paginatorrender(amount){
  // 80部 一頁12部 80/12=6...8 所以要7頁
  // Math.ceil()無條件進位
  const numberofpages = Math.ceil(amount/moviespage)

  let content =''

  for(let i = 1 ; i < numberofpages + 1 ; i++){
    content += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }

  paginator.innerHTML = content
}


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
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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

function addtofavorite(id){
  console.log(id)
  // 要取localStorage的getitem,沒有的話就給空陣列 轉成js資料取出
  // localStorage.getItem('key')
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // 抓出全部電影丟進function
  const movie = movies.find(function(movie){
    return movie.id === id
  })
  

  // some 只會回報「陣列裡有沒有 item 通過檢查條件」
  // 有的話回傳 true ，到最後都沒有就回傳 false
  if (list.some(function(movie){
    return movie.id === id
  })){
    return alert('123')
  }
  // if (list.some((movie) => movie.id === id)) {
  //       return alert('123')
  //     }
  
  // 找到id一樣的movie 推進去list
  list.push(movie)
  // 轉成JSON字串放進storage localStorage.setItem('key', JSON.stringify(value))
  localStorage.setItem('favoriteMovies', JSON.stringify(list)) 
}

// function addtofavorite(id) {
//   console.log(id)
//   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//   const movie = movies.find(function (movie) {
//     return movie.id === id
//   })
  

//   if (list.some((movie) => movie.id === id)) {
//     return alert('123')
//   }

//   list.push(movie)
//   localStorage.setItem('favoriteMovies', JSON.stringify(list))
// }


datapanel.addEventListener('click', function (event) {
  if (event.target.matches('.btn-show-movie')) {
    showmoviemodal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addtofavorite(Number(event.target.dataset.id))
  }
})

// searchform.addEventListener('submit',function(event){
//   event.preventDefault()
//   // toLowerCase 通通變小寫
//   const keyword = searchinput.value.trim().toLowerCase()
//   let filteredMovies = []
//   for(const movie of movies){
//     if (movie.title.toLowerCase().includes(keyword)){
//       filteredMovies.push(movie)
//     }
    
//   }
//   movierender(filteredMovies)
// })

searchform.addEventListener('submit', function (event) {
  event.preventDefault()
  // toLowerCase 通通變小寫
  const keyword = searchinput.value.trim().toLowerCase()
 
  
  // 只有通過這個條件函式檢查的項目，才會被 filter 保留並回傳一個新的陣列
  // 尋找movies裡的movie有沒有包含keyword的title,有包含的會變成一個新陣列
  filteredMovies = movies.filter(function (movie){
    return movie.title.toLowerCase().includes(keyword)
  })
    
  // filteredMovies = movies.filter((movie) =>
  //   movie.title.toLowerCase().includes(keyword)
  // )
  
  if (filteredMovies.length === 0 ){
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  
  // 新陣列被丟進movierender渲染畫面
  paginatorrender(filteredMovies.length)
  // 秀出第一頁搜尋結果
  movierender(getmoviespage(1))
  
})

paginator.addEventListener('click',function(event){
  if(event.target.tagName !== 'A') return
  // // 'A' =<a></a> 不等於就停止
  movierender(getmoviespage(event.target.dataset.page))
})