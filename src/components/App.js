import { lazy, useEffect, useState, Suspense } from 'react';
import './App.scss';
import '@fortawesome/fontawesome-free/js/all';
import '@fortawesome/fontawesome-free/css/all.css';
import Instructions from '../Instructions';
import Trigger from './trigger/Trigger';
import SelectedOutput from './SelectedOutput/SelectedOutput';
import { debounce } from 'lodash-es';
import { search } from '../API';

const PreloadPromise = import('./search-box/SearchBox');
const SearchBox = lazy(() => PreloadPromise);

function App() {
    const [selected, setSelected] = useState();
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [models, setModels] = useState([]);

    useEffect(() => {
        function handleKeyDown({ code, metaKey }) {
            switch (code) {
                case 'KeyK': {
                    if (metaKey) {
                        setShowSearchBox(showSearchBox => !showSearchBox);
                    }
                    break;
                }
                case 'Escape': {
                    setShowSearchBox(false);
                    break;
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    function onSearch(value) {
        setModels(search(value).map(({item}) => item));
    }

    function handleTrigger() {
        setShowSearchBox(true);
    }

    function handleSelect(model) {
        setSelected(model);
        setShowSearchBox(false);
        setModels([]);
    }

    return (
        <div className="App">
            <Instructions/>
            <div className="Implementation">
                <Trigger onTrigger={handleTrigger}/>

                {showSearchBox && (
                    <div className="bulma-container">
                        <Suspense fallback={<div>Loading...</div>}>
                            <SearchBox
                                onSelect={handleSelect}
                                models={models} onChange={debounce(onSearch, 200)}/>
                        </Suspense>
                    </div>
                )}
                <SelectedOutput selected={selected}/>
            </div>
        </div>
    );
}

export default App;
