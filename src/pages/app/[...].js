import React from 'react'
import { Router } from '@reach/router'
import BoardPage from '../../components/BoardPage';
const App = () => {
  return (
    <Router basepath="/app">
      <BoardPage path="/boards/:boardId" />
    </Router>
  )
}
export default App