// Gestione carrello su cart.html e checkout
function getCart(){ return JSON.parse(localStorage.getItem('cart') || '[]'); }
function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartUI(); }

function updateCartUI(){
  // aggiorna contatore (se presente)
  const countEl = document.getElementById('cart-count');
  const cart = getCart();
  if(countEl) countEl.innerText = cart.reduce((s,i)=>s+i.qty,0);
}

// Funzione per la pagina cart.html
function renderCartTable(){
  const tableBody = document.querySelector('#cart-table tbody');
  if(!tableBody) return;
  const cart = getCart();
  tableBody.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const tr = document.createElement('tr');
    const subtotal = item.prezzo * item.qty;
    total += subtotal;
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>€${item.prezzo.toFixed(2)}</td>
      <td><input class="qty" data-idx="${idx}" type="number" min="1" value="${item.qty}" style="width:60px" /></td>
      <td>€${subtotal.toFixed(2)}</td>
      <td><button class="btn danger remove" data-idx="${idx}">Rimuovi</button></td>
    `;
    tableBody.appendChild(tr);
  });
  const shipping = cart.length ? 5.0 : 0.0;
  document.getElementById('shipping').innerText = `€${shipping.toFixed(2)}`;
  document.getElementById('cart-total').innerText = `€${(total + shipping).toFixed(2)}`;

  // attach events
  document.querySelectorAll('.qty').forEach(input=>{
    input.addEventListener('change', e=>{
      const i = parseInt(e.target.dataset.idx);
      const v = parseInt(e.target.value || 1);
      const c = getCart();
      c[i].qty = v;
      setCart(c);
      renderCartTable();
    });
  });
  document.querySelectorAll('.remove').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.idx);
      const c = getCart();
      c.splice(i,1);
      setCart(c);
      renderCartTable();
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateCartUI();
  // pagina carrello
  if(document.querySelector('#cart-table')){
    renderCartTable();
    document.getElementById('empty-cart').addEventListener('click', ()=>{
      if(confirm('Svuotare il carrello?')){
        localStorage.removeItem('cart');
        renderCartTable();
        updateCartUI();
      }
    });
    document.getElementById('to-checkout').addEventListener('click', ()=>{
      window.location.href = 'checkout.html';
    });
  }
});
