/*
import "../../css/general.css"
import "./../../css/header.css";
import "../../css/desktop.css"
import "../../css/modal.css"
*/

import "@public/css/desktop.css"
import "@public/css/general.css"
import "@public/css/modal.css"
import "@public/css/header.css"

function Header(props) {

    let my_window = props.my_window

    function minimize() {
        my_window.currWindow.minimize();
    }
	return (
        <div>
            <header id="header" className='app-header'>
                <img src="../../img/header_icon.svg" alt="headerIcon"/>
                <h1>Sample App / desktop window</h1>
                <div className="window-controls-group">
                    <button id='minimizeButton' className="window-control window-control-minimize" onClick={minimize}></button>
                    {/*<button id='minimizeButton' className="window-control window-control-minimize" onClick={my_window.currWindow.minimize}></button>*/}
                    <button id="maximizeButton" className="window-control window-control-maximize"></button>
                    <button id="closeButton" className="window-control window-control-close"></button>
                </div>
            </header>
        </div>
    );
}

export default Header;