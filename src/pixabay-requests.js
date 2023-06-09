const API_KEY = '37153751-c1f386e7204b89aba7128be29';
const BASE_URL = 'https://pixabay.com/api/';
const axios = require('axios').default;

export default class QueryImg {
  constructor() {
    this.searchTag = ''; 
    this.page = 1;
    this.totalHits = 0;
  }

 
  getImages() {
    return axios
      .get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchTag}&image_type=photo&safesearch=true&orientation=horyzontal&page=${this.page}&per_page=40`
      )
        .then(resp => {
          this.page += 1;
          this.totalHits += resp.data.hits.length;
          console.log(this.currentHit);
            return resp.data;
      });
    }
    
    get query() {
        return this.searchTag;
    }

    set query(newQuery) {
        this.searchTag = newQuery;
    }

    resetPage() {
        this.page = 1;
    }
}