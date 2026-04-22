import { showModal } from './showModal.js';

export function openBidModal() {
    const { modalElement, modalInstance } = showModal({
        title: 'Place a Bid',
        body: `
