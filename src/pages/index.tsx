import * as React from 'react';
import styled from 'styled-components';
import DrawingBoard from '../components/DrawingBoard';
import { FULL_SCREEN } from '../styles';

const Main = styled.main`
  background: #ddd;
  ${FULL_SCREEN}
`;

// markup
const IndexPage = () => {
  return (
    <Main>
      <DrawingBoard />
    </Main>
  );
};

export default IndexPage;
