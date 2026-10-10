const menuButton = document.querySelector('#menu-toggle');
const siteNav = document.querySelector('#site-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  siteNav.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
  siteNav.classList.toggle('is-open', !isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  const clickedInsideMenu = siteNav.contains(event.target) || menuButton.contains(event.target);
  if (isOpen && !clickedInsideMenu) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const cakeOptions = [...document.querySelectorAll('.cake-option')];
const totalOutput = document.querySelector('#order-total');
const formStatus = document.querySelector('#form-status');

function updateTotal() {
  const total = cakeOptions.reduce((sum, item) => {
    const checkbox = item.querySelector('.cake-checkbox');
    const quantity = item.querySelector('.cake-quantity');
    if (!checkbox.checked) return sum;
    return sum + Number(item.dataset.price) * Number(quantity.value);
  }, 0);
  totalOutput.value = `¥${total.toLocaleString('ja-JP')}`;
  totalOutput.textContent = totalOutput.value;
}

cakeOptions.forEach((item) => {
  const checkbox = item.querySelector('.cake-checkbox');
  const quantity = item.querySelector('.cake-quantity');
  checkbox.addEventListener('change', () => {
    quantity.disabled = !checkbox.checked;
    item.classList.toggle('is-checked', checkbox.checked);
    updateTotal();
  });
  quantity.addEventListener('change', updateTotal);
});

document.querySelectorAll('.reserve-cake').forEach((button) => {
  button.addEventListener('click', () => {
    const item = cakeOptions.find((option) => option.dataset.cake === button.dataset.cake);
    if (!item) return;
    const checkbox = item.querySelector('.cake-checkbox');
    checkbox.checked = true;
    item.querySelector('.cake-quantity').disabled = false;
    item.classList.add('is-checked');
    document.querySelectorAll('.reserve-cake').forEach((other) => other.classList.remove('is-selected'));
    button.classList.add('is-selected');
    updateTotal();
    document.querySelector('#reserve').scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => checkbox.focus({ preventScroll: true }), 450);
  });
});

document.querySelector('#reservation-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const selected = cakeOptions.some((item) => item.querySelector('.cake-checkbox').checked);
  if (!selected) {
    formStatus.textContent = '予約するケーキを1種類以上選択してください。';
    cakeOptions[0].querySelector('.cake-checkbox').focus();
    return;
  }
  if (!event.currentTarget.reportValidity()) return;
  formStatus.textContent = `選択内容を確認しました。合計 ${totalOutput.value}。このサンプルでは予約内容は送信・保存されません。`;
});
