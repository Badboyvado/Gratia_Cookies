// NO onclick used anywherein html

document.addEventListener("DOMContentLoaded", () => {
  // STATE
  let qty = 1;
  let cartCount = 0;

  // Flavour Selector
  const flavourBtns = document.querySelectorAll(".flavour-btn");

  flavourBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      flavourBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("selectedFlavour").textContent = btn.dataset.flavour;
      document.getElementById("mainEmoji").textContent = btn.dataset.emoji;
      document.getElementById("flavourBadge").textContent = btn.textContent.trim();
    });
  });

  // THUMBNAILS
  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      if (thumb.dataset.emoji) {
        document.getElementById("mainEmoji").textContent = thumb.dataset.emoji;
      }
    });
  });
  // PACK SIZE SELECTOR
  const packBtns = document.querySelectorAll(".pack-btn");
  packBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      packBtns.forEach((b) => b.classList.remove("active"));
      document.getElementById("selectedPack").textContent = btn.dataset.size;
    });
  });

  // QUANTITY CONTROL
  const qtyBtns = document.querySelectorAll(".qty-btn");
  const qtyDisplay = document.getElementById("qtyNum");
  qtyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const delta = parseInt(btn.dataset.delta);
      qty = Math.max(1, qty + delta);
      qtyDisplay.textContent = qty;
    });
  });
  // ADD TO CART
  const addCartBtn = document.getElementById("addCartBtn");
  addCartBtn.addEventListener(
    "click",
    () => {
      cartCount += qty;
      document.getElementById("cartCount").textContent = cartCount;
      addCartBtn.classList.add("added");
      addCartBtn.textContent = "✅ Added to Cart";
    },
    2000,
  );
  const flavour = document.getElementById("selectedFlavour").textContent;
  const pack = document.getElementById("selectedPack").textContent;
  showToast(`🛒 ${qty} x ${flavour} (${pack} added to cart!)`);

  // BUY NOW BUTTON
  const buyNowBtn = document.querySelector(".btn-buy-now");
  buyNowBtn.addEventListener("click", () => {
    showToast("🚀Redirecting to checkout");
  });

  // TAB SWITCHER
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
      const tabId = btn.dataset.tab;
      document.getElementById("tab-" + tabId).classList.add("active");
      btn.classList.add("active");
    });
  });
  // RELATED PRODUCT CARDS
  const relatedCards = document.querySelectorAll(".related-card");
  relatedCards.forEach((card) => {
    card.addEventListener("click", () => {
      showToast(card.dataset.toast);
    });
  });
  // TOAST NOTIFICATION
  function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  // SCROLL REVEAL
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  console.log(qty);
  console.log(qtyDisplay);

  // CART DRAWER
  const cartBtn = document.getElementById("cartBin");
  const cartDrawer = document.getElementById("cartDrawer");
  const closeCart = document.getElementById("closeCart");

  cartBtn.addEventListener("click", () => {
    cartDrawer.classList.add("open");
  });
  closeCart.addEventListener("click", () => {
    cartDrawer.classList.remove("open");
  });
});
console.log(cartCount);
