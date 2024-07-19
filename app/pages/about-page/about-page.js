import { CellsPage } from '@cells/cells-page';
import { html, css } from 'lit-element';
import '@cells-demo/demo-app-template/demo-app-template.js';
import '@bbva-web-components/bbva-web-link/bbva-web-link.js';
import '@bbva-experience-components/bbva-button-default/bbva-button-default';
import '@cells-demo/demo-app-container/demo-app-container.js';

class AboutPage extends CellsPage {

  static get is() {
    return 'about-page';
  }

  static get properties() {
    return {
      fullName: { type: String },
      api: { type: String },
      date: { type: String },
      company: { type: String }
    };
  }

  constructor() {
    super();
    this.fullName = 'Lina María Sanabria Márquez';
    this.api = 'https://pokeapi.co/api/v2/pokemon';
    this.date = '19-07-24';
    this.company = 'Meraki Software Technologies ©';
  }

  render() {
    return html`
      <demo-app-template data-cells-type="template">
        <div slot="app-main-content">
            <h3>About</h3>  
            <p>${this.fullName}</p>    
            <p>Api consumida: ${this.api}</p> 
            <p>Fecha de creación: ${this.date}</p> 
            <p>${this.company}</p> 
            <bbva-button-default active=""  @click=${this.gotoGoal}>
                Back To Home
            </bbva-button-default>              
        </div>
      </demo-app-template>`;
  }

  gotoGoal() {
    this.navigate('home');
  }

}
window.customElements.define(AboutPage.is, AboutPage);