import { CellsPage } from '@cells/cells-page';
import { html, css } from 'lit-element';
import '@cells-demo/demo-app-template/demo-app-template.js';
import '@bbva-web-components/bbva-web-link/bbva-web-link.js';
import '@bbva-experience-components/bbva-button-default/bbva-button-default';
import '@cells-demo/demo-app-container/demo-app-container.js';

class EvolutionPage extends CellsPage {

  static get is() {
    return 'evolution-page';
  }

  static get properties() {
    return {
      fullName: { type: String },
      evolutions: { type: String },
    };
  }

  constructor() {
    super();
    this.fullName = 'Lina';
    this.evolutions = [];
    this.getBulbasaurEvolutions();
  }


  async getBulbasaurEvolutions() {
    try {
      const bulbasaurResponse = await fetch('https://pokeapi.co/api/v2/pokemon/1/');
      const bulbasaurData = await bulbasaurResponse.json();

      const speciesResponse = await fetch(bulbasaurData.species.url);
      const speciesData = await speciesResponse.json();
      const evolutionChainUrl = speciesData.evolution_chain.url;

      const evolutionResponse = await fetch(evolutionChainUrl);
      const evolutionData = await evolutionResponse.json();

      let currentEvolution = evolutionData.chain;

      while (currentEvolution) {
        const evolutionName = currentEvolution.species.name;
        const evolutionDetails = await this.getPokemonDetails(evolutionName);

        this.evolutions = [
          ...this.evolutions,
          {
            name: evolutionName,
            image: evolutionDetails.image,
            types: evolutionDetails.types
          }
        ];

        currentEvolution = currentEvolution.evolves_to[0];
      }

      this.evolutions = this.evolutions.slice(1); // Remove Bulbasaur itself
    } catch (error) {
      console.error('Error al obtener las evoluciones de Bulbasaur:', error);
    }
  }

  async getPokemonDetails(namePokemon) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${namePokemon}/`);
      const data = await response.json();
      const image = data.sprites.front_default;
      const types = data.types.map(typeInfo => typeInfo.type.name);

      return { image, types };
    } catch (error) {
      console.error(`Error al obtener los detalles de ${namePokemon}:`, error);
      return { image: null, types: [] };
    }
  }

  render() {
    return html`
      <demo-app-template data-cells-type="template">
        <div slot="app-main-content">
            <h3>Evoluciones</h3>     
            <bbva-button-default active=""  @click=${this.gotoGoal}>
                Back To Home
            </bbva-button-default> 
            ${this._listPokemonTpl}             
        </div>
      </demo-app-template>`;
  }

  get _listPokemonTpl() {
    return html`
    <div class="container">
      ${this.evolutions ? this.evolutions.map(pokemon => html`
        <div class="pokemon-container">
          <bbva-web-card-product class="pokemon-card">
            <!-- Imagen del Pokémon -->
            <img class="pokemon-image" slot="media" src="${pokemon.image}" alt="${pokemon.name}">
            <!-- Nombre del Pokémon -->
            <div class="pokemon-name" slot="title">${pokemon.name}</div>
            <!-- Tipos del Pokémon -->
            <div class="pokemon-type" slot="details">
              ${pokemon.types.map(typeInfo => html`<span>${typeInfo.type}</span>`)}
            </div>
          </bbva-web-card-product>
        </div>
      `) : ''}
    </div>
    `;
  }

  gotoGoal() {
    this.navigate('home');
  }

}
window.customElements.define(EvolutionPage.is, EvolutionPage);