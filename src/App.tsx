import React from 'react';
import Tasks from './components/tasks/tasks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.scss';

function App() {

  return (
    <DndProvider backend={HTML5Backend}>
      <Tasks />
    </DndProvider>
  );
}

export default App;
