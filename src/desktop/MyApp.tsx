/*
    Path + Filename: src/desktop/MyApp.tsx
*/

import Header from "./components/Header";
import Main from "./components/Main";

function MyApp(props) {
    let my_window = props.my_window
    return (
        <div>
            <Header my_window={my_window}/>
            <Main/>
        </div>
    )
}

export default MyApp