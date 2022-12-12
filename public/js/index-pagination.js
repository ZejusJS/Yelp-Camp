try {
  mapboxgl.accessToken = mapboxt;
  const paginateBtn = document.querySelector('#paginate');
  const campgroundsList = document.querySelector('section#campgrounds-list');

  const urlParams = new URLSearchParams(location.search);
  const search = urlParams.get('search');
  const stype = urlParams.get('stype');
  let campgroundsUrl = `/campgrounds?page=2&infinite=true`;
  if (search && search.length > 0) {
    campgroundsUrl = campgroundsUrl + `&search=${search}`;
  }
  if (stype && stype.length > 0) {
    campgroundsUrl = campgroundsUrl + `&stype=${stype}`;
  }
  let maxPage = false;
  let nextPage = 1;

  function startLoad() {
    // e.preventDefault();
    if (!maxPage) {
      axios({
        method: 'get',
        url: `${campgroundsUrl}`,
        headers: {
          'Accept': 'text/html'
        }
      })
        .then((res) => {
          if (res.status === 204) {
            maxPage = true
          }
          if (res.data) {
            const div = document.createElement('div');
            div.innerHTML = res.data;
            campgroundsList.append(div);
            nextPage++
            campgroundsUrl = campgroundsUrl.replace(/(page=)\d+/g, `page=${nextPage}`)
          }
        })
        .catch((err) => console.log(err));
    }
  }

  // function loadCampground(campground) {
  //   return `
  //   <div class="camp-img-container">
  //     <a href="/campgrounds/${campground._id}" class="camp-view-link"><img loading="lazy" src="${campground.images[0] ? campground.images[0].url : 'https://res.cloudinary.com/dnzagaln5/image/upload/v1669613670/YelpCamp/tent_camping_night_191593_1280x720_b6pg3p.jpg'}" alt=""></a>
  //   </div>
  //   <div class="camp-info-container">
  //     <div><a href="/campgrounds/${campground._id}" class="link-camp index">${campground.title}</a></div>
  //     <div class="camp-info">
  //       <p class="camp-description index">${campground.description}</p>
  //       <p><svg class="gps-icon-camp" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" version="1.1" xml:space="preserve">
  //           <g id="Maps">
  //             <path d="M16,1C9.38,1,4,6.38,4,13c0,6.42,10.83,17.25,11.3,17.71C15.49,30.9,15.75,31,16,31s0.51-0.1,0.7-0.29   C17.17,30.25,28,19.42,28,13C28,6.38,22.62,1,16,1z" fill="#fff" />
  //             <circle cx="16" cy="13" fill="grey" r="5" />
  //           </g>
  //         </svg>${campground.location}</p>
  //       <p>${campground.price}$</p>
  //     </div>
  //   </div>
  // `
  // }

  // window.onscroll = function () {
  //     if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 800) {
  //         startLoad();
  //     }
  // }



  var debounce_timer;
  window.onscroll = function () {
    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight - 1500) {
      if (debounce_timer) {
        window.clearTimeout(debounce_timer);
      }
      debounce_timer = window.setTimeout(function () {
        // run your actual function here
        // console.log('Fire');
        startLoad();
      }, 65);
    }

  }


  // window.onscroll = function () {
  //     console.log('Window height (px):', window.innerHeight)
  //     console.log('Currently scrolled from top (px):', window.pageYOffset)
  //     console.log('Document height(px):', document.body.offsetHeight)
  // }
} catch (e) {
  console.error(e)
};



