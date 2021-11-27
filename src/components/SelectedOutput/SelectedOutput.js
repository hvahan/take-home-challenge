import React from 'react'

function SelectedOutput({ selected }) {
  return (
    <div className="Output" data-cy="selected-output">
      <p>Selected Output:</p>
        {selected && (
            <pre>{JSON.stringify(selected, null, '\t')}</pre>
        )}
    </div>
  );
}

export default SelectedOutput;
