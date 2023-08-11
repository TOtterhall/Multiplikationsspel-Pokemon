"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const startBtn = document.querySelector(".start");
const btnContainer = document.getElementById("buttonContainer");
const container = document.getElementById("app");
const pokemons = 10;
const box1 = document.getElementById("special");
const pokemon1 = document.getElementById("pokemon1");
const form = document.getElementsByClassName(".form");

let userScore = 0;
var str = "<ul>";
pokemon1.style.visibility = "hidden";

// GÖR ATT ANVÄNDAREN INTE KAN RENDERA UT FLER ÄN 10 POKEMONKORT
let gameStarted = false;

startBtn === null || startBtn === void 0
  ? void 0
  : startBtn.addEventListener("click", () => {
      if (!gameStarted) {
        renderPokemons();
        gameStarted = true;

        startBtn.disabled = true;
      } else {
        body.classList.add("blur");
      }
    });

//KLICKA PÅ START RENDERAR UT INIT (POKEMONKORT)
function renderPokemons() {
  console.log("renderPokemons function called.");
  const fetchData = async () => {
    for (let i = 1; i <= pokemons; i++) {
      await getPokemon(i);
    }
  };

  //API FETCH
  const getPokemon = async (id) => {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await data.json();
    const pokemonType = pokemon.types.map((poke) => poke.type.name).join(", ");
    const transformedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      image: `${pokemon.sprites.front_default}`,
      type: pokemonType,
      number: pokemon.id,
    };
    showPokemon(transformedPokemon);
  };

  //VISAR POKEMONKORT
  const showPokemon = (pokemon) => {
    let output = `
        <div class="card">
          <span class="card--id" >#${pokemon.id}</span>
          <img class="card--image" src=${pokemon.image} alt=${pokemon.name} />
          <h1 class="card--name">${pokemon.name}</h1>
          <span class="card--details">${pokemon.type}</span>
          <br></br>
          <button class="card--Btn" data-id="${pokemon.id}">${pokemon.id}:ans tabell</button>
        </div>
      `;
    container.innerHTML += output;
  };

  fetchData();
}

// LYSSNA PÅ CONTAINER KLICK
container.addEventListener("click", (event) => {
  if (event.target.classList.contains("card--Btn")) {
    handleCardButtonClick(event);
  }
});
console.log("JavaScript file loaded.");

//KOLLA VILKET KORT SOM KLICKATS PÅ
function handleCardButtonClick(event) {
  const pokemonId = event.target.dataset.id;
  console.log(`Button with ID ${pokemonId} clicked`);

  // VISAR MULTIPLIKATIONSTABELLEN
  showMultiplicationTable(pokemonId);
}
let tableContainer = null;

function handleCardButtonClick(event) {
  const pokemonId = event.target.dataset.id;
  console.log(`Button with ID ${pokemonId} clicked`);

  // KOLLAR OM NÅGON MULTIPLIKATIONSTABELL ÄR ÖPPNAD
  if (!tableContainer) {
    showMultiplicationTable(pokemonId);
  } else {
    updateMultiplicationTable(pokemonId);
  }
}
function showMultiplicationTable(pokemonId) {
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("multiplication-table");

  if (tableContainer) {
    tableContainer.remove();
  }
  let tableHTML = `
        <h2>Multiplicera Pokemon ${pokemonId}</h2>
        <form id="multiplicationForm" data-pokemon-id="${pokemonId}">
          <table>
      `;

  userScore = 0;

  for (let i = 1; i <= 10; i++) {
    const result = pokemonId * i;
    const inputId = `input-${pokemonId}-${i}`;

    tableHTML += `
          <tr>
            <td>${pokemonId} x ${i}</td>
            <td>=</td>
            <td><input type="number" id="${inputId}" placeholder="Fyll i ditt svar" /></td>
          </tr>
        `;
  }
  tableHTML += `
          <tr>
            <td></td>
            <td></td>
            <td>
              <button id="submitBtn" type="submit">Submit</button>
              <button id="close-table" class="close-table">Close</button>
            </td>
          </tr>
          </table>
        </form>
        <h2 id="resultMessage"></h2>
      `;

  tableContainer.innerHTML = tableHTML;
  container.appendChild(tableContainer);

  tableContainer
    .querySelector("form")
    .addEventListener("submit", handleFormSubmit);
  tableContainer.querySelector(".close-table").addEventListener("click", () => {
    tableContainer.remove();
    tableContainer = null;
  });

  console.log("KLICKAT PÅ SUBMIT");
}

//UPPDATERAD MULTIPLIKATIONSTABELL
function updateMultiplicationTable(pokemonId) {
  const existingTableContainer = document.querySelector(
    ".multiplication-table"
  );

  if (existingTableContainer) {
    existingTableContainer.innerHTML = "";

    showMultiplicationTable(pokemonId);
  }
}
//HANTERAR SUBMIT (INSKICKADE SVARET)
function handleFormSubmit(event) {
  event.preventDefault();

  const pokemonId = event.target.dataset.pokemonId;
  const tableRows = event.target.querySelectorAll("table tr");

  tableRows.forEach((row, i) => {
    const inputId = `input-${pokemonId}-${i + 1}`;
    const userAnswer = parseInt(document.getElementById(inputId).value, 10);
    const correctAnswer = calculateCorrectAnswer(pokemonId, i + 1);

    if (userAnswer === correctAnswer) {
      row.classList.add("green");
      console.log("RÄTT");
      userScore++;
    } else {
      row.classList.add("red");
      console.log("FEL");
    }

    const resultMessage = event.target.nextElementSibling;
    resultMessage.textContent = `Dina poäng: ${userScore}`;
    console.log(resultMessage);

    localStorage.setItem("userScore", userScore);

    const totalScore = localStorage.getItem("userScore");
    let message = "";

    if (totalScore < 5) {
      message = "Du behöver nog träna lite till...";
    } else if (totalScore >= 5 && totalScore < 10) {
      message = "Bra jobbat nu är du nära =)";
    } else {
      message = "WOW! GRATTIS alla rätt du har fångat en pokemon!";
      handleWinningPokemon(pokemonId);
    }

    showPopup(`${totalScore}\n\n - poäng!\n\n${message}`);
    localStorage.setItem(`userScore_${pokemonId}`, userScore);

    event.preventDefault();
  });

  const resultMessage = event.target.nextElementSibling;
  resultMessage.textContent = `Dina poäng: ${userScore}`;
  console.log(resultMessage);

  localStorage.setItem("userScore", userScore);
}

//KALKYLERA RÄTTA SVARET
function calculateCorrectAnswer(pokemonId, multiplier) {
  return pokemonId * multiplier;
}
console.log(calculateCorrectAnswer);
const popupContainer = document.getElementById("popupContainer");
const popupContent = document.getElementById("popupContent");
const closeBtn = document.getElementById("closeBtn");
const popupMessage = document.getElementById("popupMessage");
//VISAR POP-UP
function showPopup(message) {
  const popupContainer = document.getElementById("popupContainer");
  const popupMessage = document.getElementById("popupMessage");
  const closeBtn = document.getElementById("closeBtn");

  popupMessage.textContent = message;
  popupContainer.style.display = "block";

  closeBtn.addEventListener("click", () => {
    popupContainer.style.display = "none";
  });
}

function closePopup() {
  popupContainer.style.display = "none";
}

closeBtn.addEventListener("click", closePopup);

popupContainer.addEventListener("click", (event) => {
  if (event.target === popupContainer) {
    closePopup();
  }
});
const showResultBtn = document.querySelector(".resultat");
showResultBtn.addEventListener("click", calculateTotalScore);
function calculateTotalScore() {
  let totalScore = 0;

  for (let i = 1; i <= pokemons; i++) {
    const key = `userScore_${i}`;
    const score = parseInt(localStorage.getItem(key)) || 0;
    totalScore += score;
  }

  let message = "";
  if (totalScore < 10) {
    message = "Du har skrapat ihop...";
  } else if (totalScore >= 10 && totalScore < 30) {
    message = "Det tar sig, snyggt!";
  } else {
    message = "WOW- GRATTIS Du kan det här";
  }

  showPopup(`Du har: ${totalScore} poäng\n\n${message}`);
}

const allWinningPokemonContainer = document.getElementById(
  "allWinningPokemonContainer"
);
//VISAR ALLA VUNNA POKEMONS
function showAllWinningPokemon() {
  for (let i = 1; i <= pokemons; i++) {
    const key = `userScore_${i}`;
    const score = parseInt(localStorage.getItem(key)) || 0;

    if (score === 10) {
      handleWinningPokemon(i);
    }
  }
}
//HANTERAR VINNANDE POKEMON
async function handleWinningPokemon(pokemonId) {
  const winningPokemon = document.createElement("div");
  winningPokemon.classList.add("winning-pokemon");

  const pokemonImage = document.createElement("img");
  const pokemonName = document.createElement("h2");

  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const pokemon = await data.json();
  pokemonImage.src = pokemon.sprites.front_default;
  pokemonImage.alt = pokemon.name;

  winningPokemon.appendChild(pokemonImage);
  winningPokemon.appendChild(pokemonName);

  allWinningPokemonContainer.appendChild(winningPokemon);
}
showAllWinningPokemon();
