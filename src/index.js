import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import QueryImg from './pixabay-requests.js';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const guardEl = document.querySelector('.js-guard');
const endEl = document.querySelector('.end');

const queryImg = new QueryImg();

searchFormEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  queryImg.query = event.currentTarget.elements.searchQuery.value;
  queryImg.resetPage();
  queryImg.getImages().then(images => {
    clearImagesContainer();
    appendImagesMarkup(images);
    observer.observe(guardEl);
    if (images.totalHits === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    gallery.refresh()
  });
}

const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 150,
  loop: false,
});

function appendImagesMarkup(images) {
  const imageMarkup = images.hits
    .map(
      image => `<div class="photo-card">
        <a class="gallery__link" href="${image.largeImageURL}">
        <img 
        class="gallery__image"
        src="${image.webformatURL}" 
        alt="${image.tags}" 
        loading="lazy" 
        width=300
        heihgt=300 
        />
       </a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                ${image.likes}
            </p>
            <p class="info-item">
                <b>Views</b>
                ${image.views}
            </p>
            <p class="info-item">
                <b>Comments</b>
                ${image.comments}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                ${image.downloads}
            </p>
        </div>
    </div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', imageMarkup);
}

function clearImagesContainer() {
  galleryEl.innerHTML = '';
}

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
}

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      queryImg.getImages().then(images => {
    appendImagesMarkup(images);
        gallery.refresh();
        if (queryImg.currentHits > images.totalHits) {
          observer.unobserve(guardEl);
          endEl.classList.remove('is-hidden');
        }
  });
    }
  });
}
