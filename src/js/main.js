'use strict';

const searchButton = document.querySelector('.js-searchButton');

const handleSearchButtonClick = () => {
  const searcherValue = document.querySelector('.js-searchInput').value;

  fetch(`http://api.tvmaze.com/search/shows?q=${searcherValue}`)
    .then((response) => response.json())
    .then((data) => {
      const results = data;

      for (const result of results) {
        console.log(result.show.name);
        console.log(result.show.image.medium);
      }
    });
};

searchButton.addEventListener('click', handleSearchButtonClick);
