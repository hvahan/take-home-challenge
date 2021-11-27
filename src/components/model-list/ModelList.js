import './ModelList.scss';
import { useEffect, useRef, useState } from 'react';
import { groupBy, orderBy } from 'lodash-es';

function ListItem({ model, isSelected, wrapperRef, onClick }) {
    const ref = useRef();

    useEffect(() => {
        // This section is for making sure that selected item is always visible on view port
        if (isSelected) {
            const { top: childTop, bottom: childBottom } = ref.current.getBoundingClientRect()
            const { top: parentTop, height: parentHeight } = wrapperRef.current.getBoundingClientRect()

            const toUp = childTop <= parentTop;
            const toBottom = childBottom > parentTop + parentHeight;

            if (toUp) {
                ref.current.scrollIntoView();
            } else if (toBottom) {
                ref.current.scrollIntoView(false);
            }
        }
    }, [isSelected]);

    return (
        <li ref={ref} onClick={() => onClick(model)}>
            <a className={isSelected ? 'is-active' : ''}>{model.id}</a>
        </li>
    );
}


function ModelList({ models, onSelect }) {
    const [groupedModels, setGroupedModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState();

    const sortedModelsRef = useRef();
    const selectedModelsRef = useRef();
    const wrapperRef = useRef();

    useEffect(() => {
        function handleKeyDown({ code }) {
            const sortedModels = sortedModelsRef.current;
            const currentModel = selectedModelsRef.current;

            switch (code) {
                case 'ArrowDown': {
                    const selectedIndex = sortedModels.findIndex(({ id }) => id === currentModel.id);
                    if (sortedModels[selectedIndex + 1]) {
                        setSelectedModel(sortedModels[selectedIndex + 1]);
                    }
                    break;
                }
                case 'ArrowUp': {
                    const selectedIndex = sortedModels.findIndex(({ id }) => id === currentModel.id);
                    if (sortedModels[selectedIndex - 1]) {
                        setSelectedModel(sortedModels[selectedIndex - 1]);
                    }
                    break;
                }
                case 'Enter': {
                    if (onSelect) {
                        onSelect(currentModel);
                    }
                    break;
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);


    useEffect(() => {
        const sortedModels = orderBy(
            models,
            [model => model.type.toLowerCase(), model => model.id.toLowerCase()]
        );
        const groupedModels = groupBy(sortedModels, ({ type }) => type);
        const firstSearchResult = sortedModels[0];

        setGroupedModels(groupedModels);
        setSelectedModel(firstSearchResult);
        sortedModelsRef.current = sortedModels

    }, [models]);

    useEffect(() => {
        selectedModelsRef.current = selectedModel;
    }, [selectedModel]);

    function handleClick(model) {
        setSelectedModel(model);
        if (onSelect) {
            onSelect(model);
        }
    }

    return (
        <aside ref={wrapperRef} className="menu">
            {Object.entries(groupedModels).map(([type, models]) => (
                <div key={type}>
                    <p className="menu-label has-text-primary">
                        {type}
                    </p>
                    <ul className="menu-list">
                        {models.map(model => (
                            <ListItem
                                key={model.id}
                                wrapperRef={wrapperRef}
                                model={model}
                                isSelected={model === selectedModel}
                                onClick={handleClick}
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </aside>
    );
}

export default ModelList;
