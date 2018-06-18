import React from "react";
import { render } from "react-dom";
import CCNBrowser from "./CCNBrowser";

/*
http://travail-emploi.gouv.fr/dialogue-social/negociation-collective/conventions-collectives/article/table-de-passage-entre-secteur-d-activite-et-convention-collective
*/

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

/*
todo :
 - lien direct vers texte CC (base KALI?)
 - correspondances NAF
*/

const App = () => (
  <div style={styles}>
    <h2>Trouver sa convention collective, son IDCC ou code APE</h2>
    <CCNBrowser />
    <p />
    <p>
      Source :
      <a href="http://travail-emploi.gouv.fr/dialogue-social/negociation-collective/conventions-collectives/article/table-de-passage-entre-secteur-d-activite-et-convention-collective">
        travail-emploi.gouv.fr
      </a>
    </p>
  </div>
);

render(<App />, document.getElementById("root"));
