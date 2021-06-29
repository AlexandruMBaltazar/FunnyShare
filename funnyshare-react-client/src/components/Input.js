import React from 'react'

function Input(props) {

    let inputClassName = 'form-control';

    if (props.hasError != undefined) {
        inputClassName += props.hasError ? " is-invalid" : " is-valid"
    }

    return (
        <div>
            {props.label && <label>{props.label}</label>}
            <input 
                className={inputClassName}
                type={props.type || "text"} 
                name={props.name} 
                placeholder={props.placeholder} 
                value={props.value}
                onChange={props.onChange}
            />
            {props.hasError && <span className="invalid-feedback">{props.error}</span>}
        </div>
    )
}

Input.defaultProps = {
    onChange: () => {}
}

export default Input;
