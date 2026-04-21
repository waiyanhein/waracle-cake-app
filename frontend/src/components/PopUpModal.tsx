import type React from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999, // 🔥 THIS is the important part
  },
  content: {
    top: '47%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    borderRadius: '16px',
    padding: '0px',
    border: 'none',
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
      {/* Close button */}
      <button
        onClick={onRequestClose}
        className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs px-3 py-1 rounded-lg shadow hover:bg-white transition"
      >
        ✕
      </button>
    </Modal>
  );
};
