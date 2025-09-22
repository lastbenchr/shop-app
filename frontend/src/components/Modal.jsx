import React from "react";
import styled from "styled-components";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Content>{children}</Content>
      </ModalBox>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(2px);
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.25s ease;
  /* make modal content scroll when tall */
  max-height: 90vh;
  display: flex;
  flex-direction: column;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: #475569;
  cursor: pointer;
  line-height: 1;
  &:hover {
    color: #ef4444;
  }
`;

const Content = styled.div`
  font-size: 14px;
  color: #1e293b;
  /* scrollable area */
  overflow-y: auto;
`;
