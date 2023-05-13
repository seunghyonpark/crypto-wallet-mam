import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Modal = ({ show, onClose, title, children } : any) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e:any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (

    <div
      className="
        modal-backdrop pt-[80px] pr-[0px] opacity-100 fixed top-0 left-0 w-full h-full flex flex-row justify-center items-top bg-black bg-opacity-0
        "
      onClick={() => {
        // close modal when outside of modal is clicked
        onClose();
      }}
    >

      {/*
      <StyledModalOverlay>
      */}

        
        <StyledModal>
          
          {/*
          <StyledModalHeader>
            <a href="#" onClick={handleCloseClick}>
              x
            </a>
          </StyledModalHeader>
          */}
          
          {/*title && <StyledModalTitle>{title}</StyledModalTitle>*/}
          <StyledModalBody>{children}</StyledModalBody>

        </StyledModal>

      {/*
      </StyledModalOverlay>
      */}

    </div>

  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
};

const StyledModalHeader = styled.div`
  display: flex;
  height: 10px;
  padding-right: 12px;
  justify-content: flex-end;
  font-size: 25px;
  color: #000000;
`;

const StyledModalBody = styled.div`

  padding-top: 0px;
`;



const StyledModal = styled.div`
  background: #000000;
  width: 450px;
  height: 680px;
  border-radius: 15px;
  padding: 0px;
  vertical-align: top;
`;

const StyledModalOverlay = styled.div`
  padding-top: 10px;
  padding-right: 0px;
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: right;
  align-items: top;
  background-color: rgba(0, 0, 0, 1.0);
`;

export default Modal;
