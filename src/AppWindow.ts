import { OWWindow } from "@overwolf/overwolf-api-ts";

import { useRef } from "react";
import * as React from "react";

// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared accross the desktop and in-game windows.
export class AppWindow {
  protected currWindow: OWWindow;
  protected mainWindow: OWWindow;
  protected maximized: boolean = false;

  constructor(windowName) {
    this.mainWindow = new OWWindow('background');
    this.currWindow = new OWWindow(windowName);

    /*
    const closeButton = document.getElementById('closeButton');
    const maximizeButton = document.getElementById('maximizeButton');
    const minimizeButton = document.getElementById('minimizeButton');

     */
    console.log("Window object created, this message should be shown only once.");

    /*
    const header = document.getElementById('header');

    this.setDrag(header);



    closeButton.addEventListener('click', () => {
      this.mainWindow.close();
    });

    minimizeButton.addEventListener('click', () => {
      this.currWindow.minimize();
    });

    maximizeButton.addEventListener('click', () => {
      if (!this.maximized) {
        this.currWindow.maximize();
      } else {
        this.currWindow.restore();
      }

      this.maximized = !this.maximized;
    });

     */
  }

  public async getWindowState() {
    return await this.currWindow.getWindowState();
  }

  private async setDrag(elem) {
    this.currWindow.dragMove(elem);
  }
}
