import type React from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999, // 🔥 THIS is the important part
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
  },
};

export const PopUpModal = ({
  children,
  isOpen,
  onAfterOpen,
  onRequestClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onAfterOpen?: () => void;
  onRequestClose: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {children}
    </Modal>
  );
};
