import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Modal, Backdrop } from './AgreementModal.styled';

const modalRoot = document.querySelector('#modal-root');

const AgreementModal = ({ id, children }) => {
  return createPortal(
    <Backdrop id={id}>
      <Modal>{children}</Modal>
    </Backdrop>,
    modalRoot
  );
};

AgreementModal.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default AgreementModal;
