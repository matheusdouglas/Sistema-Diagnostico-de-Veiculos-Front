import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home.jsx';
import OBD2List from './Obd2List.jsx';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/OBD2List" element={<OBD2List />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
