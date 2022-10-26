import { AppWindow } from "../../AppWindow";
import { kWindowNames } from "../../consts";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// The desktop window is the window displayed while game is not running.
// In our case, our desktop window has no logic - it only displays static data.
// Therefore, only the generic AppWindow class is called.
new AppWindow(kWindowNames.desktop);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

/*const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);*/
