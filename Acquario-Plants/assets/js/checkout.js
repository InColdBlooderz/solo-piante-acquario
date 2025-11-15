// Popola riepilogo nella pagina checkout e prepara hidden fields
function calculateTotals(){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let subtotal = cart.reduce((s,i)=> s + i.prezzo * i.qty, 0);
  let shipping = cart.length ? 5.0 : 0.0;
  let total = subtotal + shipping;
  return { cart, subtotal, shipping, total };
}

function renderCheckoutSummary(){
  const box = document.getElementById('checkout-summary');
  if(!box) return;
  const { cart, subtotal, shipping, total } = calculateTotals();
  if(!cart.length){
    box.innerHTML = '<p>Il carrello è vuoto. <a href="index.html">Vai al catalogo</a></p>';
    return;
  }
  let html = '<ul class="checkout-list">';
  cart.forEach(i=>{
    html += `<li>${i.nome} × ${i.qty} — €${(i.prezzo*i.qty).toFixed(2)}</li>`;
  });
  html += '</ul>';
  html += `<p>Subtotale: €${subtotal.toFixed(2)}</p>`;
  html += `<p>Spedizione: €${shipping.toFixed(2)}</p>`;
  html += `<p><strong>Totale: €${total.toFixed(2)}</strong></p>`;
  box.innerHTML = html;

  // popola i campi hidden
  const hiddenCart = document.getElementById('hidden-carrello');
  const hiddenTot = document.getElementById('hidden-totale');
  if(hiddenCart) hiddenCart.value = JSON.stringify(cart);
  if(hiddenTot) hiddenTot.value = total.toFixed(2);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCheckoutSummary();

  // Optional: quando l'utente cambia metodo di pagamento mostra istruzioni
  const pagamento = document.getElementById('pagamento');
  if(pagamento){
    pagamento.addEventListener('change', (e)=>{
      const val = e.target.value;
      // qui si possono mostrare istruzioni dinamiche, per ora statico
    });
  }

  // Se l'utente invia il form, Formsubmit gestisce l'invio. Dopo submit possiamo svuotare il carrello (ma meglio farlo via Webhook / manuale)
  const form = document.getElementById('checkout-form');
  if(form){
    form.addEventListener('submit', ()=>{
      // svuota carrello dopo l'invio
      setTimeout(()=>{ localStorage.removeItem('cart'); }, 1000);
    });
  }
});
