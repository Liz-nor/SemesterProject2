import { Modal } from 'bootstrap';

export function homePage() {
  const container = document.getElementById('app');

  container.innerHTML = `
    <div class="home-container">
      <h1>Welcome to NordBid</h1>
      <p>Discover unique items, place bids in real time, and win before the clock runs out. NordBid makes online auctions simple, fast, and exciting.</p>
      <span>✔ Live bidding</span>
      <span>✔ Secure selling</span>
      <span>✔ Easy to use</span>
      <button id="loginButton" class="btn btn-primary">Login</button>
    </div>
  `;

  const loginButton = document.getElementById('loginButton');
  const modalElement = document.getElementById('loginModal');

  if (!modalElement) {
    console.error('loginModal not found in the DOM');
    return;
  }

  const loginModal = new Modal(modalElement);

  loginButton.addEventListener('click', () => {
    loginModal.show();
  });
}
