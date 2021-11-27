import './SearchBox.scss'
import ModelList from '../model-list/ModelList';

function SearchBox({ models, onChange, onSelect }) {

    function handleChange(e) {
        if (onChange) {
            onChange(e.target.value);
        }
    }

    function handleSelect(model) {
        if (onSelect) {
            onSelect(model);
        }
    }

    return (
        <div className="box">
            <div className="field">
                <p className="control has-icons-left">
                    <input autoFocus className="input" type="email" placeholder="Spotlight search"
                           onChange={handleChange}/>
                    <span className="icon is-small is-left">
                       <i className="fas fa-search"/>
                </span>
                </p>
            </div>
            {!!models.length && (
                <>
                    <hr />
                    <ModelList onSelect={handleSelect} models={models} />
                </>
            )}
        </div>
    );
}

export default SearchBox;
