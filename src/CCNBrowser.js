import React from "react";
import styled from "styled-components";
import Fuse from "fuse.js";
import getSlug from "speakingurl";
import { Save } from "react-feather";

import apeByIdcc from "./data/apeByIdcc.json";
import idccByApe from "./data/idccByApe.json";
import idcc from "./data/idcc.json";
import ape from "./data/ape.json";

const DEFAULT_FUSE_OPTIONS = {
  shouldSort: true,
  //tokenize: true,
  matchAllTokens: true,
  includeMatches: true,
  //findAllMatches: true,
  includeScore: true,
  threshold: 0.75,
  //location: 0,
  //distance: 100,
  maxPatternLength: 16,
  minMatchCharLength: 3,
  keys: ["labelNormalized", "name", "idcc", "ape"]
};

// normalize strings for i18n
const normalize = str =>
  getSlug(str, {
    separator: " ",
    mark: true,
    lang: "fr",
    uric: true,
    uricNoSlash: true,
    maintainCase: true
  });

const data = [];

data.push(
  ...idcc.map(cc => ({
    idcc: cc.id,
    ape: apeByIdcc[cc.id],
    name: cc.name,
    labelNormalized: normalize(cc.name)
  })),
  ...ape.map(a => ({
    ape: a.id,
    idcc: idccByApe[a.id],
    name: a.name,
    labelNormalized: normalize(a.name)
  }))
);

const getTitle = (code, type) => {
  const result =
    type === "idcc"
      ? idcc.find(d => d.id === code)
      : ape.find(d => d.id === code);
  return result && result.name;
};

const color1 = "#6caedd";
const color2 = "#aedd6c";
const color3 = "#dd6cae";

const CodePill = styled.div`
  display: inline-block;
  margin: 5px;
  border-radius: 2px;
  padding: 3px 5px;
  font-size: 0.7rem;
  background: ${props => (props.type === "idcc" ? color1 : color3)};
  color: white;
  a {
    color: white;
    font-size: 0.7rem;
  }
`;

const Codes = ({ title, type, color, codes }) => (
  <React.Fragment>
    <ul
      style={{
        backgroundColor: "#f5f5f5",
        border: "1px solid silver",
        padding: 10
      }}
    >
      <div style={{ fontSize: "1.3em", marginBottom: 10 }}>{title}</div>
      {codes.map(code => (
        <div>
          <CodePill key={type + code} type={type}>
            {code}
          </CodePill>
          {(type === "idcc" && (
            <a
              target="_blank"
              style={{ color: "black" }}
              href={`https://www.legifrance.gouv.fr/rechConvColl.do?&champIDCC=${parseInt(
                code
              )}`}
            >
              <Save
                size={12}
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />
              {getTitle(code, type)}
            </a>
          )) ||
            getTitle(code, type)}
        </div>
      ))}
    </ul>
  </React.Fragment>
);

const ResultRow = ({ name, idcc, ape, id }) => (
  <div
    key={name + id}
    style={{
      textAlign: "left",
      padding: 10,
      border: "1px solid silver",
      marginBottom: 10,
      background: "#efefef"
    }}
  >
    <div
      style={{
        fontSize: "1.5em",
        marginBottom: 5,
        textDecoration: "underline"
      }}
    >
      {name}
    </div>
    <Codes
      title="Identifiants IDCC"
      type="idcc"
      codes={Array.isArray(idcc) ? idcc : [idcc]}
    />
    <Codes
      type="ape"
      title="Codes APE"
      codes={Array.isArray(ape) ? ape : [ape]}
    />
  </div>
);

class CCNBrowser extends React.Component {
  state = {
    query: "",
    result: []
  };
  onInputChange = e => {
    this.search(e.target.value);
  };
  search = query => {
    this.setState(
      {
        query
      },
      () => {
        this.setState({
          result: this.fuse.search(query)
        });
      }
    );
  };
  componentDidMount() {
    const options = DEFAULT_FUSE_OPTIONS;
    this.fuse = new Fuse(data, options);
    this.search(this.state.query);
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const results = this.state.result.slice(0, 10);
    return (
      <div>
        <input
          ref={node => (this.input = node)}
          value={this.state.query}
          onChange={this.onInputChange}
          placeholder="code APE, IDCC ou nom de la convention"
          style={{
            borderRadius: 3,
            padding: 5,
            width: 300,
            fontSize: "1.2em"
          }}
        />
        <br />
        {(this.state.result.length && (
          <div>{this.state.result.length} résultats</div>
        )) ||
          ""}
        <br />
        <br />
        {results.map(result => (
          <ResultRow
            key={result.item.idcc + result.item.name}
            {...result.item}
          />
        ))}
        <br />
        <br />
        {idcc.length} codes IDCC, {ape.length} codes APE
      </div>
    );
  }
}

export default CCNBrowser;
