const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'true') {
  document.body.classList.add('dark-theme');
}

const themeButton = document.querySelector('.theme-button');

if (themeButton) {
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark-theme')
    );
  });
}

/* Бургер-меню */

const burgerButton = document.querySelector('.burger-button');
const header = document.querySelector('.header');
const navigation = document.querySelector('.navigation');
const menuLink = document.querySelector('.menu-link');

let burgerMenu = null;
let burgerCloseTimer = null;

function createBurgerMenu() {
  if (!navigation) {
    return null;
  }

  const menu = document.createElement('nav');
  menu.classList.add('burger-menu');
  menu.id = 'burger-menu';
  menu.setAttribute('aria-label', 'Mobile navigation');

  const list = document.createElement('ul');
  list.classList.add('burger-menu-list');

  const navigationLinks = navigation.querySelectorAll(
    '.navigation-link'
  );

  navigationLinks.forEach((link) => {
    const item = document.createElement('li');
    item.classList.add('burger-menu-item');

    const burgerLink = document.createElement('a');
    burgerLink.classList.add('burger-menu-link');
    burgerLink.href = link.href;
    burgerLink.textContent = link.textContent.trim();

    item.append(burgerLink);
    list.append(item);
  });

  if (menuLink) {
    const item = document.createElement('li');
    item.classList.add('burger-menu-item');

    const burgerLink = document.createElement('a');
    burgerLink.classList.add(
      'burger-menu-link',
      'burger-menu-link-menu'
    );
    burgerLink.href = menuLink.href;
    burgerLink.textContent = 'Menu';

    const menuIcon = menuLink.querySelector(
      '.menu-link-icon'
    );

    if (menuIcon) {
      const icon = menuIcon.cloneNode(true);
      burgerLink.append(icon);
    }

    item.append(burgerLink);
    list.append(item);
  }

  menu.append(list);
  document.body.append(menu);

  return menu;
}

function setBurgerMenuPosition() {
  if (!burgerMenu || !header) {
    return;
  }

  const headerBottom =
    header.getBoundingClientRect().bottom;

  burgerMenu.style.top = `${headerBottom}px`;
}

function openBurgerMenu() {
  if (!burgerMenu) {
    burgerMenu = createBurgerMenu();
  }

  if (!burgerMenu) {
    return;
  }

  clearTimeout(burgerCloseTimer);

  setBurgerMenuPosition();

  burgerMenu.style.display = 'block';

  requestAnimationFrame(() => {
    burgerMenu.classList.add('burger-menu-open');
  });

  burgerButton.classList.add('burger-button-open');
  burgerButton.setAttribute('aria-expanded', 'true');
  burgerButton.setAttribute(
    'aria-controls',
    'burger-menu'
  );
  burgerButton.setAttribute(
    'aria-label',
    'Close navigation menu'
  );

  document.body.classList.add('burger-open');
}

function closeBurgerMenu() {
  if (!burgerMenu) {
    return;
  }

  burgerMenu.classList.remove('burger-menu-open');

  burgerButton.classList.remove('burger-button-open');
  burgerButton.setAttribute('aria-expanded', 'false');
  burgerButton.setAttribute(
    'aria-label',
    'Open navigation menu'
  );

  document.body.classList.remove('burger-open');

  clearTimeout(burgerCloseTimer);

  burgerCloseTimer = setTimeout(() => {
    if (
      burgerMenu &&
      !burgerMenu.classList.contains(
        'burger-menu-open'
      )
    ) {
      burgerMenu.style.display = 'none';
    }
  }, 300);
}

if (burgerButton) {
  burgerButton.setAttribute(
    'aria-expanded',
    'false'
  );

  burgerButton.addEventListener('click', () => {
    const isOpen =
      burgerButton.classList.contains(
        'burger-button-open'
      );

    if (isOpen) {
      closeBurgerMenu();
    } else {
      openBurgerMenu();
    }
  });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest(
    '.burger-menu-link'
  );

  if (
    link &&
    burgerMenu &&
    burgerMenu.contains(link)
  ) {
    closeBurgerMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    burgerButton &&
    burgerButton.classList.contains(
      'burger-button-open'
    )
  ) {
    closeBurgerMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeBurgerMenu();
  } else {
    setBurgerMenuPosition();
  }
});

/* Слайдер */

const slider = document.querySelector('.slider');
const sliderTrack =
  document.querySelector('.slider-track');
const sliderCards =
  document.querySelectorAll('.slider-card');
const sliderButtons =
  document.querySelectorAll('.slider-button');
const sliderControls =
  document.querySelectorAll('.slider-control');

let currentSlide = 0;

function updateSlider() {
  if (
    !sliderTrack ||
    sliderCards.length === 0
  ) {
    return;
  }

  sliderTrack.style.transform =
    `translateX(-${currentSlide * 100}%)`;

  sliderControls.forEach((control, index) => {
    control.classList.toggle(
      'slider-control-active',
      index === currentSlide
    );
  });
}

function changeSlide(direction) {
  if (sliderCards.length === 0) {
    return;
  }

  currentSlide += direction;

  if (currentSlide < 0) {
    currentSlide =
      sliderCards.length - 1;
  }

  if (
    currentSlide >= sliderCards.length
  ) {
    currentSlide = 0;
  }

  updateSlider();
}

sliderButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (index === 0) {
      changeSlide(-1);
    } else {
      changeSlide(1);
    }
  });
});

sliderControls.forEach((control, index) => {
  control.addEventListener('click', () => {
    currentSlide = index;
    updateSlider();
  });
});

let touchStartX = 0;
let touchEndX = 0;

if (slider) {
  slider.addEventListener(
    'touchstart',
    (event) => {
      touchStartX =
        event.touches[0].clientX;
    },
    { passive: true }
  );

  slider.addEventListener(
    'touchend',
    (event) => {
      touchEndX =
        event.changedTouches[0].clientX;

      const swipeDistance =
        touchEndX - touchStartX;

      if (Math.abs(swipeDistance) < 50) {
        return;
      }

      if (swipeDistance < 0) {
        changeSlide(1);
      } else {
        changeSlide(-1);
      }
    },
    { passive: true }
  );
}

updateSlider();

/* Каталог */

const menuGrid =
  document.querySelector('.menu-grid');
const categoryButtons =
  document.querySelectorAll('.menu-category');
const showMoreButton =
  document.querySelector('.menu-more');

let products = [];
let currentCategory = 'coffee';
let isExpanded = false;
let wasMobile =
  window.innerWidth <= 768;

async function loadProducts() {
  if (!menuGrid) {
    return;
  }

  try {
    const response =
      await fetch('./products.json');

    if (!response.ok) {
      throw new Error(
        'Failed to load products.json'
      );
    }

    products = await response.json();

    renderProducts(currentCategory);
  } catch (error) {
    console.error(
      'Error loading products:',
      error
    );
  }
}

function parsePrice(value) {
  return Number.parseFloat(
    String(value).replace('$', '')
  );
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function getProductImage(product) {
  const imageName = product.name
    .toLowerCase()
    .replace(/ /g, '-');

  const imageExtension =
    product.category === 'coffee'
      ? 'jpg'
      : 'png';

  return `images/${imageName}.${imageExtension}`;
}

function renderProducts(category) {
  if (!menuGrid) {
    return;
  }

  menuGrid.innerHTML = '';
  isExpanded = false;

  const categoryProducts =
    products.filter(
      (product) =>
        product.category === category
    );

  categoryProducts.forEach((product) => {
    const card =
      document.createElement('article');

    card.classList.add('menu-card');

    const imageContainer =
      document.createElement('div');

    imageContainer.classList.add(
      'menu-card-image'
    );

    const image =
      document.createElement('img');

    image.src =
      getProductImage(product);

    image.alt = product.name;

    imageContainer.append(image);

    const content =
      document.createElement('div');

    content.classList.add(
      'menu-card-content'
    );

    const title =
      document.createElement('h2');

    title.classList.add(
      'menu-card-title'
    );

    title.textContent =
      product.name;

    const description =
      document.createElement('p');

    description.classList.add(
      'menu-card-description'
    );

    description.textContent =
      product.description;

    const price =
      document.createElement('p');

    price.classList.add(
      'menu-card-price'
    );

    price.textContent =
      `$${product.price}`;

    content.append(
      title,
      description,
      price
    );

    card.append(
      imageContainer,
      content
    );

    menuGrid.append(card);

    card.addEventListener(
      'click',
      () => {
        openProductModal(product);
      }
    );
  });

  updateCardVisibility();
}

function updateCardVisibility() {
  if (!menuGrid) {
    return;
  }

  const cards =
    menuGrid.querySelectorAll(
      '.menu-card'
    );

  const isMobile =
    window.innerWidth <= 768;

  const hasHiddenCards =
    cards.length > 4;

  if (!isMobile) {
    cards.forEach((card) => {
      card.style.display = '';
    });

    if (showMoreButton) {
      showMoreButton.style.display =
        'none';
    }

    return;
  }

  if (isExpanded) {
    cards.forEach((card) => {
      card.style.display = '';
    });

    if (showMoreButton) {
      showMoreButton.style.display =
        'none';
    }

    return;
  }

  cards.forEach((card, index) => {
    card.style.display =
      index < 4 ? '' : 'none';
  });

  if (showMoreButton) {
    showMoreButton.style.display =
      hasHiddenCards
        ? 'inline-block'
        : 'none';
  }
}

if (showMoreButton) {
  showMoreButton.addEventListener(
    'click',
    () => {
      isExpanded = true;
      updateCardVisibility();
    }
  );
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentCategory =
      button.dataset.category;

    categoryButtons.forEach((item) => {
      item.classList.remove(
        'menu-category-active'
      );
    });

    button.classList.add(
      'menu-category-active'
    );

    renderProducts(
      currentCategory
    );
  });
});

/* Модальное окно */

let modalOverlay = null;
let selectedProduct = null;
let selectedSize = 0;
let selectedAdditives = [];

function createProductModal() {
  if (modalOverlay) {
    return;
  }

  modalOverlay =
    document.createElement('div');

  modalOverlay.classList.add(
    'product-modal-overlay'
  );

  modalOverlay.setAttribute(
    'aria-hidden',
    'true'
  );

  const modal =
    document.createElement('div');

  modal.classList.add(
    'product-modal'
  );

  modal.setAttribute(
    'role',
    'dialog'
  );

  modal.setAttribute(
    'aria-modal',
    'true'
  );

  const closeButton =
    document.createElement('button');

  closeButton.type = 'button';

  closeButton.classList.add(
    'product-modal-close'
  );

  closeButton.setAttribute(
    'aria-label',
    'Close'
  );

  closeButton.textContent = '×';

  const modalImage =
    document.createElement('img');

  modalImage.classList.add(
    'product-modal-image'
  );

  const modalContent =
    document.createElement('div');

  modalContent.classList.add(
    'product-modal-content'
  );

  const modalTitle =
    document.createElement('h2');

  modalTitle.classList.add(
    'product-modal-title'
  );

  const modalDescription =
    document.createElement('p');

  modalDescription.classList.add(
    'product-modal-description'
  );

  const sizeTitle =
    document.createElement('p');

  sizeTitle.classList.add(
    'product-modal-option-title'
  );

  sizeTitle.textContent = 'Size';

  const sizeOptions =
    document.createElement('div');

  sizeOptions.classList.add(
    'product-modal-options'
  );

  sizeOptions.dataset.option =
    'size';

  const additivesTitle =
    document.createElement('p');

  additivesTitle.classList.add(
    'product-modal-option-title'
  );

  additivesTitle.textContent =
    'Additives';

  const additivesOptions =
    document.createElement('div');

  additivesOptions.classList.add(
    'product-modal-options'
  );

  additivesOptions.dataset.option =
    'additives';

  const totalRow =
    document.createElement('div');

  totalRow.classList.add(
    'product-modal-total'
  );

  const totalTitle =
    document.createElement('span');

  totalTitle.textContent = 'Total:';

  const totalPrice =
    document.createElement('span');

  totalPrice.classList.add(
    'product-modal-price'
  );

  totalRow.append(
    totalTitle,
    totalPrice
  );

  modalContent.append(
    modalTitle,
    modalDescription,
    sizeTitle,
    sizeOptions,
    additivesTitle,
    additivesOptions,
    totalRow
  );

  modal.append(
    closeButton,
    modalImage,
    modalContent
  );

  modalOverlay.append(modal);

  document.body.append(modalOverlay);

  closeButton.addEventListener(
    'click',
    closeProductModal
  );

  modalOverlay.addEventListener(
    'click',
    (event) => {
      if (
        event.target === modalOverlay
      ) {
        closeProductModal();
      }
    }
  );
}

function updateProductModal() {
  if (
    !modalOverlay ||
    !selectedProduct
  ) {
    return;
  }

  const modal =
    modalOverlay.querySelector(
      '.product-modal'
    );

  const modalImage =
    modal.querySelector(
      '.product-modal-image'
    );

  const modalTitle =
    modal.querySelector(
      '.product-modal-title'
    );

  const modalDescription =
    modal.querySelector(
      '.product-modal-description'
    );

  const sizeOptions =
    modal.querySelector(
      '[data-option="size"]'
    );

  const additivesOptions =
    modal.querySelector(
      '[data-option="additives"]'
    );

  const totalPrice =
    modal.querySelector(
      '.product-modal-price'
    );

  const sizes =
    Object.values(
      selectedProduct.sizes
    );

  const additives =
    Object.values(
      selectedProduct.additives
    );

  modalImage.src =
    getProductImage(
      selectedProduct
    );

  modalImage.alt =
    selectedProduct.name;

  modalTitle.textContent =
    selectedProduct.name;

  modalDescription.textContent =
    selectedProduct.description;

  sizeOptions.innerHTML = '';
  additivesOptions.innerHTML = '';

  sizes.forEach(
    (size, index) => {
      const button =
        document.createElement('button');

      button.type = 'button';

      button.classList.add(
        'product-modal-option'
      );

      if (
        index === selectedSize
      ) {
        button.classList.add(
          'product-modal-option-active'
        );
      }

      const sizeName =
        document.createElement('span');

      sizeName.textContent =
        size.size;

      const sizePrice =
        document.createElement('span');

      const addPrice =
        parsePrice(
          size['add-price']
        );

      sizePrice.textContent =
        `+$${addPrice.toFixed(2)}`;

      button.append(
        sizeName,
        sizePrice
      );

      button.addEventListener(
        'click',
        () => {
          selectedSize = index;
          updateProductModal();
        }
      );

      sizeOptions.append(button);
    }
  );

  additives.forEach(
    (additive, index) => {
      const button =
        document.createElement('button');

      button.type = 'button';

      button.classList.add(
        'product-modal-option'
      );

      if (
        selectedAdditives.includes(
          index
        )
      ) {
        button.classList.add(
          'product-modal-option-active'
        );
      }

      const additiveName =
        document.createElement('span');

      additiveName.textContent =
        additive.name;

      const additivePrice =
        document.createElement('span');

      const addPrice =
        parsePrice(
          additive['add-price']
        );

      additivePrice.textContent =
        `+$${addPrice.toFixed(2)}`;

      button.append(
        additiveName,
        additivePrice
      );

      button.addEventListener(
        'click',
        () => {
          if (
            selectedAdditives.includes(
              index
            )
          ) {
            selectedAdditives =
              selectedAdditives.filter(
                (item) =>
                  item !== index
              );
          } else {
            selectedAdditives.push(
              index
            );
          }

          updateProductModal();
        }
      );

      additivesOptions.append(
        button
      );
    }
  );

  let finalPrice =
    parsePrice(
      selectedProduct.price
    );

  finalPrice += parsePrice(
    sizes[selectedSize]['add-price']
  );

  selectedAdditives.forEach(
    (index) => {
      finalPrice += parsePrice(
        additives[index]['add-price']
      );
    }
  );

  totalPrice.textContent =
    formatPrice(finalPrice);
}

function openProductModal(product) {
  createProductModal();

  selectedProduct = product;
  selectedSize = 0;
  selectedAdditives = [];

  updateProductModal();

  modalOverlay.classList.add(
    'product-modal-overlay-open'
  );

  modalOverlay.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'modal-open'
  );
}

function closeProductModal() {
  if (!modalOverlay) {
    return;
  }

  modalOverlay.classList.remove(
    'product-modal-overlay-open'
  );

  modalOverlay.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'modal-open'
  );
}

document.addEventListener(
  'keydown',
  (event) => {
    if (
      event.key === 'Escape' &&
      modalOverlay &&
      modalOverlay.classList.contains(
        'product-modal-overlay-open'
      )
    ) {
      closeProductModal();
    }
  }
);

window.addEventListener('resize', () => {
  const isMobile =
    window.innerWidth <= 768;

  if (isMobile !== wasMobile) {
    isExpanded = false;
    wasMobile = isMobile;
  }

  updateCardVisibility();

  if (burgerMenu) {
    setBurgerMenuPosition();
  }
});

loadProducts();
