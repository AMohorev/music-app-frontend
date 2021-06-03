import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = (props) => {
    const modalContent = (
        <div className="modal__main">
            <header className="modal__header">
                <h2>{props.header}</h2>
            </header>
            <div className="modal__content">{props.children}</div>
            <div className="modal__footer d-flex flex-row justify-content-between">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={props.onCancel}
                >
                    Close
                </button>
                {props.footer}
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-hook")
    );
};

const Modal = (props) => {
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames="modal"
            >
                <ModalOverlay {...props} />
            </CSSTransition>
        </React.Fragment>
    );
};

export default Modal;
