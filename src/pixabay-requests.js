import axios from 'axios';
import Notiflix from 'notiflix';
export { queryImg };

const API_KEY = '37153751-c1f386e7204b89aba7128be29';
axios.defaults.baseURL = 'https://pixabay.com/api/';  

async function queryImg(searchValue, page) {
  try {
    const { data } = await axios.get('?', {
      params: {
        key: API_KEY,
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: page,
      },
    });
    return data;
  } catch (error) {
     Notiflix.Notify.failure(
       `Oops! Something went wrong! Try reloading the page!`
     );
  }
}