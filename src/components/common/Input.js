import React from 'react';


const Input = ({value,onChange}) => {

    return (
        <div>
            <input className="input" placeholder="Search Photos" value={value} onChange={onChange}/>
        </div>
    );
};

export default Input;
