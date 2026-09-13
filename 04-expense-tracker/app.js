const form = document.getElementById('expenseForm');
const list = document.getElementById('list');
const total = document.getElementById('total');
const count = document.getElementById('count');
const empty = document.getElementById('empty');
const filter = document.getElementById('filter');
const clearAll = document.getElementById('clearAll');

let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

function save(){ localStorage.setItem('expenses', JSON.stringify(expenses)); }
function money(value){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value); }
function render(){
  const category = filter.value;
  const shown = category === 'All' ? expenses : expenses.filter(x => x.category === category);
  list.innerHTML = shown.map(x => `<article class="item"><div class="meta"><strong>${escapeHtml(x.description)}</strong><span class="category">${escapeHtml(x.category)}</span></div><div class="right"><span class="amount">${money(x.amount)}</span><button class="delete" data-id="${x.id}" aria-label="Delete ${escapeHtml(x.description)}">Delete</button></div></article>`).join('');
  const sum = expenses.reduce((a,x)=>a+x.amount,0);
  total.textContent = money(sum); count.textContent = String(expenses.length); empty.style.display = shown.length ? 'none' : 'block';
}
function escapeHtml(value){ const div=document.createElement('div'); div.textContent=value; return div.innerHTML; }
form.addEventListener('submit', e=>{ e.preventDefault(); const description=document.getElementById('description').value.trim(); const category=document.getElementById('category').value; const amount=Number(document.getElementById('amount').value); if(!description || amount<=0) return; expenses.unshift({id:Date.now(),description,category,amount}); save(); form.reset(); render(); });
list.addEventListener('click', e=>{ if(!e.target.matches('.delete')) return; const id=Number(e.target.dataset.id); expenses=expenses.filter(x=>x.id!==id); save(); render(); });
filter.addEventListener('change', render);
clearAll.addEventListener('click', ()=>{ if(!expenses.length) return; expenses=[]; save(); render(); });
render();
