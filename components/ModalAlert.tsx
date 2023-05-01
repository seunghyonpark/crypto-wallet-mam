import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const ModalAlert = ({ show, onClose, title, children } : any) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e:any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (

    <StyledModalOverlay>
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
    </StyledModalOverlay>


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
  color: #ffffff;
`;

const StyledModalBody = styled.div`

  padding-top: 0px;
`;



const StyledModal = styled.div`
  background: #24252F;
  width: 250px;
  height: 400px;
  border-radius: 15px;
  padding: 0px;
  vertical-align: top;
`;

const StyledModalOverlay = styled.div`
  padding-top: 10px;
  padding-right: 10px;
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: top;
  background-color: rgba(0, 0, 0, 0.5);
`;

export default ModalAlert;
