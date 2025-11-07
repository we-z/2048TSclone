import React from "react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="info-modal-backdrop" onClick={onClose}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="info-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2>How to Play</h2>
        <div className="info-modal-content">
          <div className="info-section">
            <h3>
              <span role="img" aria-label="target">
                🎯
              </span>{" "}
              Goal
            </h3>
            <p>Merge tiles to create higher numbers and score big!</p>
          </div>

          <div className="info-section">
            <h3>
              <span role="img" aria-label="rules">
                📝
              </span>{" "}
              Rules
            </h3>
            <p>Tiles with the same number merge and increment by 1</p>
            <p className="rule-examples">1 & 1 → 2, 2 & 2 → 3, 3 & 3 → 4...</p>
            <p>
              New tiles spawn as <strong>1</strong> or <strong>2</strong>
            </p>
          </div>

          <div className="info-section">
            <h3>
              <span role="img" aria-label="controls">
                🕹️
              </span>{" "}
              Controls
            </h3>
            <p>
              <strong>Arrow Keys</strong> or <strong>Swipe</strong> to move
              tiles
            </p>
          </div>

          <div className="info-section tips">
            <h3>
              <span role="img" aria-label="tips">
                💡
              </span>{" "}
              Pro Tips
            </h3>
            <p>Keep high tiles in corners • Build in one direction</p>
            <p>
              <strong>Shortcuts:</strong> Press <strong>I</strong> or{" "}
              <strong>Esc</strong> to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
