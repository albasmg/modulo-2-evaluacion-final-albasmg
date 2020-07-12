'use strict';

const searchButton = document.querySelector('.js-searchButton');
const resultsContainer = document.querySelector('.js-resultsContainer');
const favoriteSeries = JSON.parse(localStorage.getItem('series')) || [];

const removeLastSearch = () => (resultsContainer.innerHTML = '');

const addSeriesListeners = () => {
  const series = document.querySelectorAll('.main__seriesContainer');
  for (const li of series) {
    li.addEventListener('click', handleAddToFavoritesClick);
  }
};

const findSerieInFavorites = (serieId) =>
  favoriteSeries.find((favoriteSerie) => serieId === favoriteSerie.id);

const handleAddToFavoritesClick = (event) => {
  const selectedSerieImage = event.currentTarget.querySelector('img').src;
  const selectedSerieName = event.currentTarget.querySelector(
    '.main__seriesName'
  ).innerHTML;
  const selectedSerieId = parseInt(event.currentTarget.id);

  const favoriteSerie = {
    id: selectedSerieId,
    name: selectedSerieName,
    image: selectedSerieImage,
  };

  const isSerieInFavorites = findSerieInFavorites(selectedSerieId);

  if (!isSerieInFavorites) {
    event.currentTarget.classList.toggle('selected');
    favoriteSeries.push(favoriteSerie);
    localStorage.setItem('series', JSON.stringify(favoriteSeries));
    printFavorites();
  }
};

const printFavorites = (favoriteSerie) => {
  const favorite = favoriteSerie || favoriteSeries[favoriteSeries.length - 1];

  const favoritesContainer = document.querySelector('.js-favoritesContainer');
  const favoriteSerieContainer = document.createElement('div');
  const favoriteSerieImage = document.createElement('img');
  const favoriteSerieNameElement = document.createElement('p');
  const favoriteSerieName = document.createTextNode(favorite.name);

  favoritesContainer.appendChild(favoriteSerieContainer);
  favoriteSerieContainer.appendChild(favoriteSerieImage);
  favoriteSerieContainer.appendChild(favoriteSerieNameElement);
  favoriteSerieNameElement.appendChild(favoriteSerieName);

  favoriteSerieImage.setAttribute(
    'src',
    !favorite.image
      ? 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV'
      : favorite.image
  );

  favoriteSerieContainer.classList.add('main__favoriteSerieContainer');
  favoriteSerieImage.classList.add('main__favoriteImage');
  favoriteSerieNameElement.classList.add('main__favoriteName');
};

const printResults = (results) => {
  removeLastSearch();
  for (const result of results) {
    const serieId = result.show.id;
    const serieName = result.show.name;
    const serieImage = result.show.image;

    const seriesContainer = document.createElement('li');
    const serieImageElement = document.createElement('img');
    const serieNameElement = document.createElement('p');
    const serieNameContent = document.createTextNode(`${serieName}`);

    resultsContainer.appendChild(seriesContainer);
    seriesContainer.appendChild(serieImageElement);
    seriesContainer.appendChild(serieNameElement);
    serieNameElement.appendChild(serieNameContent);

    seriesContainer.setAttribute('id', serieId);
    serieImageElement.setAttribute(
      'src',
      !serieImage
        ? 'https://via.placeholder.com/210x295/ffffff/666666/? text=TV'
        : serieImage.medium
    );

    seriesContainer.classList.add('main__seriesContainer');
    serieNameElement.classList.add('main__seriesName');

    const isSerieInFavorites = findSerieInFavorites(serieId);

    if (isSerieInFavorites) {
      seriesContainer.classList.add('selected');
    }
  }
  addSeriesListeners();
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

const printFavoriteSeriesOnStart = () => {
  for (const favoriteSerie of favoriteSeries) {
    printFavorites(favoriteSerie);
  }
};
printFavoriteSeriesOnStart();
