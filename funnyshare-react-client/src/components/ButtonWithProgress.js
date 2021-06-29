import React from 'react'

function ButtonWithProgress(props) {
    return (
        <div>
            <button 
                className="btn btn-primary" 
                onClick={props.onClick} 
                disabled={props.disabled}
            >
                {props.pendingApiCall && (
                    <div className="spinner-border text-light spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                <span>{props.text}</span>
            </button>
        </div>
    )
}

export default ButtonWithProgress;
