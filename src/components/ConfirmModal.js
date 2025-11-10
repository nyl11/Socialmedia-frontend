import './dialog.css';

const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <p>{message || "Are you sure you want to delete this post?"}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="delete-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
