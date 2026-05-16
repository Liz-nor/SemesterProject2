export function footer() {
  const container = document.getElementById('footer');
  container.innerHTML = `<footer class="bg-dark text-center text-lg-start text-white">
  <div class="container p-4">
    <div class="row justify-content-between">
        <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
            <p class="fw-bold m-0">Contact us:</p>
            <p class="m-0">Email: info@nordbid.com</p>
            <p class="m-0">Phone: +1 (234) 567-890</p>
        </div>
        <div class="mt-4">
            <p>Visit our facebook</p>
            <a href="https://www.facebook.com/nordbid" target="_blank" class="text-white">
                <i class="fab fa-facebook fa-2x"></i>
            </a>
            </p>
            <p class="m-0">Visit our twitter</p>
            <a href="https://www.twitter.com/nordbid" target="_blank" class="text-white">
                <i class="fab fa-twitter fa-2x"></i>
            </a>
            </p>
            <div class="mb-4">
                <p class="m-0">Links:</p>
                <a href="#/about" class="text-white text-decoration-none">About Us</a><br>
                <a href="#/contact" class="text-white text-decoration-none">Contact</a><br>
                <a href="#/terms" class="text-white text-decoration-none">Terms of Service</a><br>
                <a href="#/privacy" class="text-white text-decoration-none">Privacy Policy</a><br>
            </div>
        </div>
        <p class="mt-4 justify-content-center align-items-center text-center">
            NordBid is a leading online auction platform connecting buyers and sellers across the globe. We offer a wide
            range of products, from electronics to collectibles, ensuring a seamless and secure bidding experience for
            all our users.
        </p>
    </div>
  <div class="text-center p-3">© 2026 NordBid</div>
  </footer>`;
}
