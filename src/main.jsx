import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialProducts = [
  { id: 1, name: 'تيشيرت BRAVEN الأساسي', category: 'أساسيات', price: 799, oldPrice: 950, color: 'أسود', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85', badge: 'الأكثر مبيعاً' },
  { id: 2, name: 'تيشيرت الظل الثقيل', category: 'جديد', price: 899, color: 'فحمي', sizes: ['M','L','XL'], image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=85', badge: 'جديد' },
  { id: 3, name: 'تيشيرت Signature الأبيض', category: 'أساسيات', price: 749, color: 'أبيض', sizes: ['S','M','L'], image: 'https://images.unsplash.com/photo-1583743814966-8936f37f4f0a?w=900&q=85' },
  { id: 4, name: 'تيشيرت Night Runner', category: 'إصدارات محدودة', price: 999, oldPrice: 1150, color: 'أسود', sizes: ['S','M','L','XL'], image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900&q=85', badge: 'محدود' }
];

function getProducts() { try { return JSON.parse(localStorage.getItem('braven_products')) || initialProducts; } catch { return initialProducts; } }
const money = n => `${n.toLocaleString('ar-EG')} ج.م`;

function App() {
  const [products, setProducts] = useState(getProducts);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('braven_cart') || '[]'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('braven_user') || 'null'));
  const [view, setView] = useState('home');
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('braven_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('braven_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => { if (toast) { const t=setTimeout(()=>setToast(''), 2600); return ()=>clearTimeout(t); } }, [toast]);
  const total = useMemo(() => cart.reduce((s, x) => s + x.price * x.qty, 0), [cart]);
  const add = (p, size='M') => { setCart(c => { const found=c.find(x=>x.id===p.id && x.size===size); return found ? c.map(x=>x===found?{...x,qty:x.qty+1}:x) : [...c,{...p,size,qty:1}]; }); setToast('تمت إضافة القطعة إلى حقيبتك'); };
  const remove = item => setCart(c=>c.filter(x=>!(x.id===item.id && x.size===item.size)));
  const openProduct = p => { setSelected(p); setView('product'); window.scrollTo(0,0); };

  return <>
    <header className="header"><div className="header-inner">
      <button className="icon mobile-menu" onClick={()=>setMenu(!menu)}>☰</button><button className="brand" onClick={()=>setView('home')}>BRAVEN<span>®</span></button>
      <nav className={menu?'nav open':'nav'}><button onClick={()=>{setView('home');setMenu(false)}}>الرئيسية</button><button onClick={()=>{setView('shop');setMenu(false)}}>المتجر</button><button onClick={()=>{setView('about');setMenu(false)}}>قصتنا</button></nav>
      <div className="header-actions"><button className="icon" onClick={()=>setView('account')}>♙</button><button className="bag" onClick={()=>setView('cart')}>الحقيبة <b>{cart.reduce((s,x)=>s+x.qty,0)}</b></button></div>
    </div></header>
    {view==='home' && <Home products={products} open={openProduct} shop={()=>setView('shop')} />}
    {view==='shop' && <Shop products={products} open={openProduct} add={add} />}
    {view==='product' && selected && <Product p={selected} add={add} back={()=>setView('shop')} />}
    {view==='cart' && <Cart cart={cart} total={total} remove={remove} checkout={()=>user?setView('checkout'):setView('account')} />}
    {view==='checkout' && <Checkout total={total} onDone={()=>{setCart([]);setToast('تم استلام طلبك بنجاح');setView('home')}} />}
    {view==='account' && <Account user={user} setUser={u=>{setUser(u);localStorage.setItem('braven_user',JSON.stringify(u));setView('home')}} />}
    {view==='about' && <About />}
    {view==='admin' && <Admin products={products} setProducts={setProducts} />}
    <footer><div><div className="brand">BRAVEN<span>®</span></div><p>Wear your attitude.</p></div><div><b>تواصل معنا</b><p>hello@braven.store<br/>القاهرة، مصر</p></div><div><b>روابط</b><p>الشحن والاستبدال<br/>الأسئلة الشائعة</p></div></footer>
    {toast && <div className="toast">✓ {toast}</div>}
    <button className="admin-link" onClick={()=>setView('admin')}>ADMIN</button>
  </>;
}

function Home({products,open,shop}) { return <main><section className="hero"><div className="hero-copy"><p className="eyebrow">BRAVEN / FALL 2024</p><h1>البس<br/><em>شخصيتك.</em></h1><p className="hero-text">قطع مصممة للناس اللي مش بتخاف تسيب أثر. جودة تعيش، وتفاصيل تتكلم عنك.</p><button className="primary" onClick={shop}>اكتشف المجموعة <span>←</span></button></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=90"/><div className="hero-tag">NEW<br/><b>DROP 01</b></div></div></section><section className="ticker"><span>MADE TO BE NOTICED</span><span>—</span><span>BRAVEN ESSENTIALS</span><span>—</span><span>MADE TO BE NOTICED</span></section><section className="section"><div className="section-head"><div><p className="eyebrow">THE ESSENTIALS</p><h2>اختياراتك الأساسية</h2></div><button className="text-btn" onClick={shop}>شوف الكل ←</button></div><div className="grid">{products.slice(0,4).map(p=><Card key={p.id} p={p} open={open}/>)}</div></section><section className="statement"><p className="eyebrow">OUR PHILOSOPHY</p><h2>مش مجرد<br/><span>تيشيرت.</span></h2><p>BRAVEN معمول عشان يديك مساحة تكون على طبيعتك. من أول الخامة لآخر تفصيلة، كل حاجة ليها معنى.</p></section></main> }
function Card({p,open}) { return <article className="card" onClick={()=>open(p)}><div className="card-img">{p.badge&&<span className="badge">{p.badge}</span>}<img src={p.image}/><button className="quick">عرض المنتج +</button></div><div className="card-info"><div><h3>{p.name}</h3><small>{p.color} / {p.category}</small></div><div className="price">{money(p.price)}{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div></div></article> }
function Shop({products,open,add}) { const [cat,setCat]=useState('الكل'); const cats=['الكل','أساسيات','جديد','إصدارات محدودة']; const shown=cat==='الكل'?products:products.filter(p=>p.category===cat); return <main className="page"><div className="page-title"><p className="eyebrow">COLLECTION 01</p><h1>المتجر</h1><p>قطع أساسية، بتفاصيل مش عادية.</p></div><div className="filters">{cats.map(c=><button className={cat===c?'active':''} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div><div className="grid shop-grid">{shown.map(p=><Card key={p.id} p={p} open={open}/>)}</div></main> }
function Product({p,add,back}) { const [size,setSize]=useState(p.sizes[1]||p.sizes[0]); return <main className="page product-page"><button className="back" onClick={back}>→ العودة للمتجر</button><div className="product-detail"><div className="product-large"><img src={p.image}/></div><div className="product-copy"><p className="eyebrow">{p.category}</p><h1>{p.name}</h1><div className="big-price">{money(p.price)} {p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><p className="desc">خامة قطنية ثقيلة مختارة بعناية، بقصة مريحة وتفاصيل مصممة عشان تفضل معاك.</p><hr/><b>اختار المقاس</b><div className="sizes">{p.sizes.map(s=><button className={size===s?'selected':''} onClick={()=>setSize(s)} key={s}>{s}</button>)}</div><button className="primary full" onClick={()=>add(p,size)}>أضف للحقيبة — {money(p.price)}</button><div className="details">✓ شحن سريع داخل مصر<br/>✓ استبدال خلال 14 يوم<br/>✓ خامة قطن 100%</div></div></div></main> }
function Cart({cart,total,remove,checkout}) { return <main className="page narrow"><div className="page-title"><p className="eyebrow">YOUR SELECTION</p><h1>حقيبتك</h1></div>{!cart.length?<div className="empty"><h2>الحقيبة فاضية.</h2><p>لسه مفيش حاجة اخترتها.</p></div>:<><div className="cart-list">{cart.map((x,i)=><div className="cart-row" key={i}><img src={x.image}/><div><h3>{x.name}</h3><p>المقاس: {x.size}</p></div><b>{money(x.price*x.qty)}</b><button onClick={()=>remove(x)}>×</button></div>)}</div><div className="summary"><span>الإجمالي</span><strong>{money(total)}</strong><button className="primary full" onClick={checkout}>إتمام الطلب</button></div></>}</main> }
function Account({user,setUser}) { const [email,setEmail]=useState(''); const [name,setName]=useState(''); return <main className="page auth"><div className="auth-card"><p className="eyebrow">WELCOME TO BRAVEN</p><h1>{user?'أهلاً، '+user.name:'حسابك يبدأ هنا'}</h1>{user?<><p>تقدر تتابع طلباتك وتعدل بياناتك من هنا.</p><button className="primary full" onClick={()=>{localStorage.removeItem('braven_user');setUser(null)}}>تسجيل الخروج</button></>:<><p>أنشئ حسابك عشان تكمل الطلب وتتابع كل جديد.</p><label>الاسم<input value={name} onChange={e=>setName(e.target.value)} placeholder="اسمك بالكامل"/></label><label>البريد الإلكتروني<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/></label><button className="primary full" disabled={!name||!email} onClick={()=>setUser({name,email})}>إنشاء حساب والمتابعة</button></>}</div></main> }
function Checkout({total,onDone}) { return <main className="page auth"><div className="auth-card"><p className="eyebrow">CHECKOUT</p><h1>بيانات التوصيل</h1><label>العنوان<input placeholder="العنوان بالتفصيل"/></label><label>رقم الهاتف<input placeholder="01xxxxxxxxx"/></label><label>طريقة الدفع<select><option>الدفع عند الاستلام</option><option>تحويل بنكي (قريباً)</option></select></label><button className="primary full" onClick={onDone}>تأكيد الطلب — {money(total)}</button></div></main> }
function About(){return <main className="page narrow about"><p className="eyebrow">THE BRAVEN STORY</p><h1>اتولدنا عشان<br/><em>نختلف.</em></h1><p>BRAVEN علامة مصرية للملابس اليومية. بنؤمن إن الستايل مش محتاج صوت عالي، بس محتاج يكون صادق.</p></main>}
function Admin({products,setProducts}) { const blank={name:'',category:'أساسيات',price:'',color:'أسود',sizes:['S','M','L','XL'],image:''}; const [form,setForm]=useState(blank); const [editing,setEditing]=useState(null); const save=e=>{e.preventDefault(); if(!form.name||!form.price||!form.image)return; if(editing)setProducts(products.map(p=>p.id===editing?{...form,id:editing,price:+form.price}:p)); else setProducts([...products,{...form,id:Date.now(),price:+form.price}]); setForm(blank);setEditing(null)}; const edit=p=>{setForm(p);setEditing(p.id);window.scrollTo(0,0)}; return <main className="admin-page"><div className="admin-head"><div><p className="eyebrow">BRAVEN CONTROL ROOM</p><h1>إدارة المنتجات</h1></div><button className="secondary" onClick={()=>{setForm(blank);setEditing(null)}}>+ منتج جديد</button></div><form className="product-form" onSubmit={save}><h2>{editing?'تعديل المنتج':'إضافة تيشيرت جديد'}</h2><div className="form-grid"><label>اسم المنتج<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>السعر<input required type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>التصنيف<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>أساسيات</option><option>جديد</option><option>إصدارات محدودة</option></select></label><label>اللون<input value={form.color} onChange={e=>setForm({...form,color:e.target.value})}/></label><label className="wide">رابط الصورة<input required value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..."/></label></div><button className="primary" type="submit">{editing?'حفظ التعديلات':'إضافة المنتج'}</button></form><div className="admin-products">{products.map(p=><div className="admin-row" key={p.id}><img src={p.image}/><div><b>{p.name}</b><p>{money(p.price)} · {p.category}</p></div><button className="secondary" onClick={()=>edit(p)}>تعديل</button><button className="danger" onClick={()=>confirm('حذف المنتج؟')&&setProducts(products.filter(x=>x.id!==p.id))}>حذف</button></div>)}</div></main> }
createRoot(document.getElementById('root')).render(<App/>);
