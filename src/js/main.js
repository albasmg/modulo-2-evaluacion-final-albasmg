'use strict';

const searchButton = document.querySelector('.js-searchButton');

const handleSearchButtonClick = () => {
  const searcherValue = document.querySelector('.js-searchInput').value;

  fetch(`http://api.tvmaze.com/search/shows?q=${searcherValue}`)
    .then((response) => response.json())
    .then((data) => {
      printResults(data);
    });
};

const printResults = (results) => {
  const resultsContainer = document.querySelector('.js-resultsContainer');
  resultsContainer.innerHTML = '';

  for (const result of results) {
    const serieName = result.show.name;
    const serieImage = result.show.image.medium;

    const seriesContainer = document.createElement('div');
    const serieImageElement = document.createElement('img');
    const serieNameElement = document.createElement('p');
    const serieNameContent = document.createTextNode(`${serieName}`);

    resultsContainer.appendChild(seriesContainer);
    seriesContainer.appendChild(serieImageElement);
    seriesContainer.appendChild(serieNameElement);
    serieNameElement.appendChild(serieNameContent);

    serieImageElement.setAttribute('src', `${serieImage}`);
  }
};

searchButton.addEventListener('click', handleSearchButtonClick);
