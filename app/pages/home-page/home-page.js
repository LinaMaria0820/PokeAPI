import { CellsPage } from '@cells/cells-page';
import { html, css } from 'lit-element';
import '@cells-demo/demo-app-template/demo-app-template.js';
import '@bbva-web-components/bbva-web-link/bbva-web-link.js';
import '@bbva-experience-components/bbva-button-default/bbva-button-default.js';

class HomePage extends CellsPage {
  static get is() {
    return 'home-page';
  }
  static get properties() {
    return {
      title: { type: String },
      pokemonList: { type: Array },
    };
  }
  static get styles() {
    return css`
    .title{
      text-align:center;
    }

    .about{
      display: block;
    }

    .evolutions-button{
    margin-right: 10px;
    }

    .container{
      display:flex;
      flex-flow: row wrap;
      text-align:center;
    }

    .pokemon-container{
      width: 150px;
      height: 200px;
      margin-top: 10px;
      margin-right: 10px;
      margin-bottom: 50px;
      border-radius: 20px;
      font-weight: bold;
      background-image: url("https://cdn.pixabay.com/photo/2016/07/23/13/21/pokemon-1536855_640.png");
      background-size: 100% 100%; 
    }
  `;
  }

  constructor() {
    super();
    this.title = 'Pokemones';
    this.pokemonList = [];
    this.fetchPokemonData();
  }

  async fetchPokemonData() {
    try {
      //Get all pokemons
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=75'
      );
      const data = await response.json();

      //Get pokemon details
      const detailedData = await Promise.all(
        data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );

      // Filter base pokemons without evolutions
      const basePokemon = await Promise.all(
        detailedData.map(async(pokemon) => {
          const speciesResponse = await fetch(pokemon.species.url);
          const speciesData = await speciesResponse.json();
          return speciesData.evolves_from_species ? null : pokemon;
        })
      );

      //Filter nulls on the final list
      this.pokemonList = basePokemon.filter((pokemon) => pokemon !== null);
      console.log(this.pokemonList);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  }

  render() {
    return html` <demo-app-template data-cells-type="template">
      <div slot="app-main-content">
      <h3 class=title>${this.title}</h3>
      <bbva-web-link class=about @click=${this.gotoAbout}>Go to About</bbva-web-link>  
      ${this._listPokemonTpl}
      </div>
    </demo-app-template>`;
  }

  get _listPokemonTpl() {
    return html`
    <div class="container">
      ${this.pokemonList ? this.pokemonList.map(pokemon => html`
        <div class="pokemon-container">
          <bbva-web-card-product class="pokemon-card">
            <!-- Imagen del Pokemon -->
            <img class="pokemon-image" slot="media" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <br><br><br>
            <!-- Nombre del Pokemon -->
            <div class="pokemon-name" slot="title">${pokemon.name}</div>
            <!-- Tipos del Pokemon -->
            <div class="pokemon-type" slot="details">
              ${pokemon.types.map(typeInfo => html`<span>${typeInfo.type.name}</span>`)}
            </div>
          </bbva-web-card-product>
          <br>
          <bbva-button-default @click=${this.goToEvolution} class="evolutions-button" text="Evoluciones"></bbva-button-default>
        </div>
      `) : ''}
    </div>
    `;
  }

  goToHome() {
    this.navigate('home');
  }

  gotoAbout() {
    this.navigate('about');
  }

  goToEvolution() {
    this.navigate('evolution');
  }

}

window.customElements.define(HomePage.is, HomePage);