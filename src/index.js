import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { queryImg } from './pixabay-requests.js';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const guardEl = document.querySelector('.guard');
const secondGuardEl = document.querySelector('.secondGuard');

Notiflix.Notify.init({
  width: '320px',
  position: 'right-top', 
  timeout: 5000,
});

let gallery = new SimpleLightbox('.gallery a', {
  animationSpeed: 150,
  fadeSpeed: 150,
  animationSlide: false,
  showCounter: false,
  captionDelay: 250,
  captionsData: 'alt',
});

let page = 1;
let searchValue = '';

secondGuardEl.style.display = "none";

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
              getImg();
              const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();
              window.scrollBy({
                top: cardHeight * 2,
                behavior: 'smooth',
              });
            }
        });
  }, { rootMargin: '500px' });
    
const secondObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      });
    },
    { rootMargin: '100px' }
  );

formEl.addEventListener('submit', handleSubmitFormImgSearch);

function handleSubmitFormImgSearch(event) {
    event.preventDefault();
    const inputValue = event.target.elements.searchQuery.value;
  if (!inputValue.trim() || inputValue === searchValue) {
       Notiflix.Notify.failure(
      'Please, enter some search query ');
       return;
  }
    secondGuardEl.style.display = 'none';
    galleryEl.innerHTML = '';
    observer.unobserve(guardEl);
    page = 1;
    searchValue = inputValue;
    getImg();
}

function renderMarkup(data) {
    console.log(data);
    const markup = data.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}"><img class="gallery__image" src="${webformatURL}" alt="${tags}" width="360px" height: "200px" loading="lazy" /></a>
            <div class="info">
            <p class="info-item">
              <b>Likes</b> <span class="data-wrapper">${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b> <span class="data-wrapper">${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b> <span class="data-wrapper">${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b> <span class="data-wrapper">${downloads}</span>
            </p>
          </div>
        </div>`;
        }
      )
      .join('');
galleryEl.insertAdjacentHTML('beforeend', markup)
}

async function getImg() {
  const data = await queryImg(searchValue, page);
  if (data.totalHits === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  renderMarkup(data);

  gallery.refresh();

  if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
  if (page === 1 && data.totalHits <= 20) {
     observer.unobserve(guardEl);
     return;
   }
  if (page === 1 && data.totalHits <= 40) {
    secondGuardEl.style.display = 'block';
    secondObserver.observe(secondGuardEl);
    observer.unobserve(guardEl);
    return;
  }
  if (Math.ceil(data.totalHits / 40) === page) {
    observer.unobserve(guardEl);
    secondGuardEl.style.display = 'block';
    secondObserver.observe(secondGuardEl);
    return;
  }
  observer.observe(guardEl);
  page += 1;
}