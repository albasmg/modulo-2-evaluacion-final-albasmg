'use strict';

const searchButton = document.querySelector('.js-searchButton');
const resultsContainer = document.querySelector('.js-resultsContainer');

const removeLastSearch = () => {
  resultsContainer.innerHTML = '';
};

const printResults = (results) => {
  removeLastSearch();
  for (const result of results) {
    const serieName = result.show.name;
    const serieImage = result.show.image;

    const seriesContainer = document.createElement('div');
    const serieImageElement = document.createElement('img');
    const serieNameElement = document.createElement('p');
    const serieNameContent = document.createTextNode(`${serieName}`);

    resultsContainer.appendChild(seriesContainer);
    seriesContainer.appendChild(serieImageElement);
    seriesContainer.appendChild(serieNameElement);
    serieNameElement.appendChild(serieNameContent);

    serieImageElement.setAttribute(
      'src',
      !serieImage
        ? 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV'
        : serieImage.medium
    );
  }
};

const handleSearchButtonClick = () => {
  const searcherValue = document.querySelector('.js-searchInput').value;

  if (!searcherValue) {
    removeLastSearch();
    const alertMessageElement = document.createElement('p');
    const alertMessage = document.createTextNode('Escribe algo :)');
    resultsContainer.appendChild(alertMessageElement);
    alertMessageElement.appendChild(alertMessage);
  } else {
    fetch(`http://api.tvmaze.com/search/shows?q=${searcherValue}`)
      .then((response) => response.json())
      .then((data) => {
        printResults(data);
      });
  }
};

searchButton.addEventListener('click', handleSearchButtonClick);
