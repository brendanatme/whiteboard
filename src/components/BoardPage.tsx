import * as React from 'react';
import styled from 'styled-components';
import DrawingBoard from './DrawingBoard';
import { FULL_SCREEN } from '../styles';

const Main = styled.main`
  background: #ddd;
  ${FULL_SCREEN}
`;

// markup
const BoardPage = () => {
  return (
    <Main>
      <DrawingBoard />
    </Main>
  );
};

export default BoardPage;
