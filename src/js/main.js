'use strict';

const searchButton = document.querySelector('.js-searchButton');
const resultsContainer = document.querySelector('.js-resultsContainer');
const favoritesContainer = document.querySelector('.js-favoritesContainer');
const favoritesToggleContainer = document.querySelector('.js-favoritesToggle');
const noFavoritesMsg = document.querySelector('.js-noFavoritesMsg');
let favoriteSeries = JSON.parse(localStorage.getItem('series')) || [];
let originalSeries = [];

const removeLastSearch = () => (resultsContainer.innerHTML = '');

const addSeriesListeners = () => {
  const series = document.querySelectorAll('.series__container');
  for (const li of series) {
    li.addEventListener('click', handleAddToFavoritesClick);
  }
};

const findSerieInFavorites = (serieId) =>
  favoriteSeries.find((favoriteSerie) => serieId === favoriteSerie.id);

const removeSerieInFavorites = (serieId) =>
  favoriteSeries.filter((favoriteSerie) => serieId !== favoriteSerie.id);

const handleAddToFavoritesClick = (event) => {
  const selectedSerieImage = event.currentTarget.querySelector('img').src;
  const selectedSerieName = event.currentTarget.querySelector('.series__name')
    .innerHTML;
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

    const heartIcon = document.querySelector('.fa-heart');
    heartIcon.classList.add('animated-heart');
    setTimeout(() => heartIcon.classList.remove('animated-heart'), 2000);

    printFavorite();
  } else {
    event.currentTarget.classList.toggle('selected');
    favoriteSeries = removeSerieInFavorites(selectedSerieId);
    localStorage.setItem('series', JSON.stringify(favoriteSeries));
    favoritesContainer.innerHTML = '';

    for (const favoriteSerie of favoriteSeries) {
      printFavorite(favoriteSerie);
    }
  }

  showRemoveAllFavoritesButton();
};

const printFavorite = (favoriteSerie) => {
  const favorite = favoriteSerie || favoriteSeries[favoriteSeries.length - 1];

  const favoriteSerieContainer = document.createElement('div');
  const removeFavoriteButton = document.createElement('button');
  const favoriteSerieImage = document.createElement('img');
  const favoriteSerieNameElement = document.createElement('p');
  const favoriteSerieName = document.createTextNode(favorite.name);
  const removeFavoriteButtonIcon = document.createElement('i');

  favoritesContainer.appendChild(favoriteSerieContainer);
  favoriteSerieContainer.appendChild(removeFavoriteButton);
  favoriteSerieContainer.appendChild(favoriteSerieImage);
  favoriteSerieContainer.appendChild(favoriteSerieNameElement);
  favoriteSerieNameElement.appendChild(favoriteSerieName);
  removeFavoriteButton.appendChild(removeFavoriteButtonIcon);

  favoriteSerieImage.setAttribute(
    'src',
    !favorite.image ? 'assets/images/no-image.png' : favorite.image
  );

  removeFavoriteButton.setAttribute('class', 'far fa-trash-alt');

  favoriteSerieContainer.classList.add('favorites__container');
  favoriteSerieImage.classList.add('favorites__image');
  favoriteSerieNameElement.classList.add('favorites__name');
  removeFavoriteButton.classList.add('favorites__removeButton');

  const handleRemoveFavoriteClick = () => {
    const newFavoriteSeries = favoriteSeries.filter(
      (favoriteSerie) => favoriteSerie.id !== favorite.id
    );
    localStorage.setItem('series', JSON.stringify(newFavoriteSeries));

    favoritesContainer.innerHTML = '';

    favoriteSeries = newFavoriteSeries;

    if (!favoriteSeries.length) {
      removeAllFavoritesButton.classList.add('hidden');
      noFavoritesMsg.classList.remove('hidden');
    }

    removeLastSearch();
    printResults(originalSeries);

    for (const newFavoriteSerie of newFavoriteSeries) {
      printFavorite(newFavoriteSerie);
    }
  };

  removeFavoriteButton.addEventListener('click', handleRemoveFavoriteClick);
};

const removeAllFavoritesButton = document.querySelector(
  '.js-removeAllFavoritesButton'
);

const handleRemoveAllFavoritesClick = () => {
  favoriteSeries = [];
  localStorage.removeItem('series');
  favoritesContainer.innerHTML = '';
  removeAllFavoritesButton.classList.toggle('hidden');
  noFavoritesMsg.classList.remove('hidden');
  printResults(originalSeries);
};

removeAllFavoritesButton.addEventListener(
  'click',
  handleRemoveAllFavoritesClick
);

const printResults = (results) => {
  removeLastSearch();
  for (const result of results) {
    const serieId = result.show.id;
    const serieName = result.show.name;
    const serieImage = result.show.image;

    const seriesContainer = document.createElement('li');
    const serieImageElement = document.createElement('img');
    const serieNameElement = document.createElement('p');
    const serieNameContent = document.createTextNode(serieName);

    resultsContainer.appendChild(seriesContainer);
    seriesContainer.appendChild(serieImageElement);
    seriesContainer.appendChild(serieNameElement);
    serieNameElement.appendChild(serieNameContent);

    seriesContainer.setAttribute('id', serieId);
    serieImageElement.setAttribute(
      'src',
      !serieImage ? 'assets/images/no-image.png' : serieImage.medium
    );

    seriesContainer.classList.add('series__container');
    serieNameElement.classList.add('series__name');
    serieImageElement.classList.add('series__image');

    const isSerieInFavorites = findSerieInFavorites(serieId);

    if (isSerieInFavorites) {
      seriesContainer.classList.add('selected');
      serieNameElement.classList.add('selected-name');
    }
  }
  addSeriesListeners();
};

const handleSearchButtonClick = () => {
  const searcherValue = document.querySelector('.js-searchInput').value;
  const noResultsFoundElement = document.querySelector('.js-noResultsFoundMsg');

  if (!searcherValue) {
    removeLastSearch();
    noResultsFoundElement.classList.add('hidden');

    const alertMessageElement = document.createElement('p');
    const alertMessage = document.createTextNode(
      'Para que pueda ayudarte a buscar tus series favoritas, tienes que escribir algo en el buscador 💁🏻‍♀️'
    );
    resultsContainer.appendChild(alertMessageElement);
    alertMessageElement.appendChild(alertMessage);

    alertMessageElement.classList.add('error-message');
  } else {
    fetch(`https://api.tvmaze.com/search/shows?q=${searcherValue}`)
      .then((response) => response.json())
      .then((data) => {
        originalSeries = data;
        if (!data.length) {
          console.log('entro');
          noResultsFoundElement.classList.remove('hidden');
        } else {
          noResultsFoundElement.classList.add('hidden');
        }
        printResults(data);
      });
  }
};

const searcher = document.querySelector('.js-searchInput');

searcher.addEventListener('keyup', function pressEnterToSearch(event) {
  if (event.keyCode === 13) {
    handleSearchButtonClick();
  }
});

searchButton.addEventListener('click', handleSearchButtonClick);

const favoritesToggle = document.querySelector('.favorites__headingContainer');

const handleFavoritesToggleClick = () => {
  const favoritesArrow = document.querySelector('.fa-chevron-down');
  favoritesToggleContainer.classList.toggle('hidden');
  favoritesArrow.classList.toggle('rotate-arrow');
};

favoritesToggle.addEventListener('click', handleFavoritesToggleClick);

const showRemoveAllFavoritesButton = () => {
  if (favoriteSeries.length) {
    removeAllFavoritesButton.classList.remove('hidden');
    noFavoritesMsg.classList.add('hidden');
  }
};

const printFavoriteSeriesOnStart = () => {
  for (const favoriteSerie of favoriteSeries) {
    printFavorite(favoriteSerie);
  }
};

printFavoriteSeriesOnStart();
showRemoveAllFavoritesButton();
