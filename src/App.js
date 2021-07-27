import React from "react";
import { Web } from "./components/pages/Web";
import styled from "styled-components";

const Container = styled.div`
  font-family: Rubik;
`;

function App() {
  return (
    <Container>
      <Web></Web>
    </Container>
  );
}

export default App;
