import { showModal } from './showModal.js';
import { placeBid } from '../../services/bids.js';

export function openBidModal(item) {
  const { modalElement, modalInstance } = showModal({
    title: 'Place a Bid',
    body: `
        <form id="bidForm">
            <div class="mb-3">
                <label for="bidAmount" class="form-label">Bid Amount</label>
                <input 
                type="number" 
                min="1" 
                step="1" 
                class="form-control" 
                id="bidAmount" 
                name="bidAmount" 
                required>
            </div>
            <button type="submit" class="btn btn-primary">Place Bid</button>
        </form>

        <div id="bidMessage" class="text-danger small mt-2"></div>
        `,
  });

  const bidForm = modalElement.querySelector('#bidForm');
  const bidInput = modalElement.querySelector('#bidAmount');
  const bidMessage = modalElement.querySelector('#bidMessage');

  bidForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = Number(bidInput.value);

    if (isNaN(amount) || amount <= 0) {
      bidMessage.textContent = 'Please enter a valid number';
      return;
    }

    try {
      await placeBid(item.id, amount);
      modalInstance.hide();
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Error placing bid:', error);
      bidMessage.textContent = 'Failed to place bid. Please try again.';
    }
  });
}
