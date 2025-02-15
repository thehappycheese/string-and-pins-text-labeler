import { Alice } from "./alice";
import { MainView } from "./components/MainView";
import { Menu } from "./components/Menu";
import { SelectorHost, SelectorOption } from "./components/Selector";
import { TextHost } from "./components/TextHost";

function App() {
    
    return <>
        <Menu>
            <SelectorHost>
                <SelectorOption text={"TypeA"} highlighted={false}/>
                <SelectorOption text={"TypeB"} highlighted={false}/>
            </SelectorHost>
        </Menu>
        <MainView>
            <TextHost
                selected_ranges={[
                    {start:5, end:16},
                    {start:150, end:220},
                    {start:350, end:360},
                ]}
                connected_ranges={[
                    {from:0, to:1},
                    {from:1, to:0},
                    {from:1, to:2},
                ]}
            >
                <Alice/>
            </TextHost>
        </MainView>
    </>
}

export default App;
