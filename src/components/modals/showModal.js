import { Modal } from 'bootstrap';

export function showModal({ title = '', body = '', footer = '' }) {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    console.error('modal-root not found');
    return null;
  }

  modalRoot.innerHTML = `<div class="modal fade" id="appModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            ${body}
          </div>

          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}

        </div>
      </div>
    </div>
    `;

  const modalElement = document.getElementById('appModal');
  const modalInstance = new Modal(modalElement);

  modalElement.addEventListener('hidden.bs.modal', () => {
    modalRoot.innerHTML = '';
  });

  modalInstance.show();

  return { modalElement, modalInstance };
}
