import { AppWindow } from "../AppWindow";
import { kWindowNames } from "../consts";
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header/index';
//import Header from 'desktop/components/Header/index';

// The desktop window is the window displayed while game is not running.
// In our case, our desktop window has no logic - it only displays static data.
// Therefore, only the generic AppWindow class is called.
let my_window = new AppWindow(kWindowNames.desktop);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Header my_window={my_window}/>
  </React.StrictMode>
);

/*const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);*/
