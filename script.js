document.addEventListener("DOMContentLoaded", () => {
  // STATE
  let qty = 1;
  let cartItems = [
    {
      emoji: "🍪",
      name: "Gratia Cookies",
      meta: "Original -30g",
      flavour: "Original",
      price: 750,
      qty: 1,
    },
    {
      emoji: "🍫",
      name: "Gratia Cookies",
      meta: "Chocolate -45g",
      flavour: "Chocolate",
      price: 1500,
      qty: 1,
    },
    {
      emoji: "🥥",
      name: "Gratia Cookies",
      meta: "Coconut -1kg",
      flavour: "Coconut",
      price: 2500,
      qty: 1,
    },
  ];

  const priceMap = {
    "30g": 750,
    "45g": 1500,
    "1kg": 2500,
  };

  // FLAVOUR SELECTOR
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
      btn.classList.add("active");
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
  addCartBtn.addEventListener("click", () => {
    const flavour = document.getElementById("selectedFlavour").textContent;
    const size = document.getElementById("selectedPack").textContent;
    const emoji = document.getElementById("mainEmoji").textContent;
    const price = priceMap[size] || 750;
    // Build a unique id so same flavour + size stacks
    const itemId = `${flavour}-${size}`;
    const existing = cartItems.find((i) => i.id === itemId);

    if (existing) {
      existing.qty += qty;
    } else {
      cartItems.push({ id: itemId, name: "Gratia cookies", flavour, size, price, emoji, qty });
    }
    // Button Feedback
    addCartBtn.classList.add("added");
    addCartBtn.textContent = "✅ Added to Cart";
    setTimeout(() => {
      addCartBtn.classList.remove("added");
      addCartBtn.textContent = "🛒 Add to Cart";
    }, 2000);
    updateCartUI();
    showToast(`🛒${qty} x ${flavour} (${size}) added to cart!`);
    openDrawer();
  });

  // BUY NOW
  document.querySelector(".btn-buy-now").addEventListener("click", () => {
    showToast("🚀Redirecting to checkout...");
  });

  // CART DRAWER - OPEN / CLOSE
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartNavBtn = document.getElementById("cartBin");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const continueBtn = document.getElementById("continueShoppingBtn");

  function openDrawer() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; //prevent bg scroll
  }
  function closeDrawer() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
  cartNavBtn.addEventListener("click", openDrawer);
  cartCloseBtn.addEventListener("click", closeDrawer);
  cartOverlay.addEventListener("click", closeDrawer);
  continueBtn.addEventListener("click", closeDrawer);

  // CLose drawer with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // CART UI - render items, totals, badges
  function updateCartUI() {
    const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    // NAV Cart Count
    document.getElementById("cartCount").textContent = totalQty;
    //Drawer badge
    document.getElementById("drawerCartCount").textContent = totalQty;
    // Subtotal
    document.getElementById("cartSubtotal").textContent = `₦${totalPrice.toLocaleString()}`;

    const cartEmpty = document.getElementById("cartEmpty");
    const cartItemsList = document.getElementById("cartItemsList");
    if (cartItems.length === 0) {
      cartEmpty.style.display = "flex";
      cartItemsList.innerHTML = "";
      return;
    }
    cartEmpty.style.display = "none";
    // render each item
    cartItemsList.innerHTML = cartItems
      .map(
        (item) => `<div class="cart-item" data-id="${item.id}">
         <div class="cart-item-emoji">${item.emoji}</div>
         <div class="cart-item-name">${item.name}</div>
         <div class="cart-item-meta">${item.flavour} . ${item.size}</div>
         <div class="cart-item-bottom">
         <span class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</span>
          <div class="cart-item-controls">
           <button class="cart-qty-btn" data-id="${item.id}" data-action="decrease">-</button>
            <span class="cart-item-qty">${item.qty}</span>
            <button class="cart-qty-btn" data-id="${item.id}" data-action="increase">+</button>
       </div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" title="Remove">🗑️</button>
     </div>`,
      )
      .join("");

    // Attach events to newly rendered buttons
    cartItemsList.querySelectorAll(".cart-qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.classList.id;
        const action = btn.classList.action;
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;
        if (action === "increase") {
          item.qty++;
        } else {
          item.qty--;
          if (item.qty <= 0) {
            cartItems = cartItems.filter((i) => i.id !== id);
          }
        }
        updateCartUI();
      });
    });

    cartItemsList.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        cartItems = cartItems.filter((i) => i.id !== btn.dataset.id);
        updateCartUI();
        showToast("🗑️ Item removed from cart");
      });
    });
  }
  // TAB SWITCHER
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
      tabBtns.forEach((b) => b.classList.remove("active"));
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      btn.classList.add("active");
    });
  });
  // RELATED PRODUCT CARDS
  document.querySelectorAll(".related-card").forEach((card) => {
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
});
