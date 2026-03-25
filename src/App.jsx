import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ArrowRight, Zap, Monitor, Layout, Image as ImageIcon, CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { fetchStorefront, FETCH_PRODUCTS_QUERY, CHECKOUT_CREATE_MUTATION } from './lib/shopify';

const GEMINI_MODELS = ['gemini-3-flash-preview', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showMockSuccess, setShowMockSuccess] = useState(false);
  const [error, setError] = useState(null);

  const storefrontDomain = import.meta.env.VITE_SHOPIFY_STORENAME;

  useEffect(() => {
    async function getShopifyProducts() {
      try {
        setLoading(true);
        const result = await fetchStorefront(FETCH_PRODUCTS_QUERY, { first: 20 });
        if (result?.data?.products?.edges) {
          const shopifyProducts = result.data.products.edges.map(({ node }) => ({
            id: node.id,
            title: node.title,
            variantId: node.variants.edges[0]?.node?.id,
            category: "Premium Assets", // Grouping live products
            price: node.variants.edges[0]?.node?.price?.amount || 0,
            image: node.images.edges[0]?.node?.url || "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
            description: node.description,
            currency: node.variants.edges[0]?.node?.price?.currencyCode || 'USD'
          }));
          setProducts(shopifyProducts);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to connect to Shopify Demo Store.");
      } finally {
        setLoading(false);
      }
    }
    getShopifyProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = async () => {
    if (storefrontDomain === 'mock.shop' || !storefrontDomain) {
      setCheckoutLoading(true);
      setTimeout(() => {
        setCheckoutLoading(false);
        setIsCartOpen(false);
        setShowMockSuccess(true);
      }, 2000);
      return;
    }

    try {
      setCheckoutLoading(true);
      const lineItems = cart.map(item => ({ variantId: item.variantId, quantity: 1 }));
      const result = await fetchStorefront(CHECKOUT_CREATE_MUTATION, { input: { lineItems } });

      if (result?.data?.checkoutCreate?.checkout?.webUrl) {
        window.location.href = result.data.checkoutCreate.checkout.webUrl;
      } else {
        setTimeout(() => {
          setCheckoutLoading(false);
          setIsCartOpen(false);
          setShowMockSuccess(true);
        }, 1500);
      }
    } catch (err) {
      setTimeout(() => {
        setCheckoutLoading(false);
        setIsCartOpen(false);
        setShowMockSuccess(true);
      }, 1500);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setActiveCategory('All')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold -rotate-45">C</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">CREATIVE.STUDIO</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-widest uppercase">
            {['Services', 'Portfolio', 'Shop', 'Contact'].map(link => (
              <button key={link} className="hover:text-indigo-400 transition-colors text-neutral-400">{link}</button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-neutral-800 rounded-full transition-colors group">
              <ShoppingCart size={24} className="group-hover:text-indigo-400" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-[10px] flex items-center justify-center rounded-full border-2 border-neutral-950 font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 italic">
                <Zap size={14} />
                <span>URBAN DESIGN INFRASTRUCTURE</span>
              </div>
              <h1 className="text-6xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-12 italic uppercase">
                DESIGN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">SYSTEMS.</span>
              </h1>
              <p className="text-xl text-neutral-500 max-w-lg mb-12 leading-relaxed italic">
                Premium UI kits, urban textures, and digital product assets curated for professionals. Elevate your creative workflow.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-white text-black font-black flex items-center space-x-3 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1 rounded-sm uppercase italic tracking-tighter"
                >
                  <span>SHOP COLLECTIONS</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
            <div className="relative group perspective-1000">
               <div className="absolute -inset-4 bg-indigo-500/10 rounded-xl blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
               <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" 
                alt="Workspace"
                className="relative rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000 border border-neutral-800/50 shadow-2xl rotate-2 group-hover:rotate-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Marquee */}
      <section className="bg-neutral-900/50 border-y border-neutral-800 py-16 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex space-x-12 items-center opacity-30">
          {[1,2,3,4,5,6].map(i => (
            <React.Fragment key={i}>
              <span className="text-4xl font-black italic uppercase tracking-tighter">UI DESIGN</span>
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span className="text-4xl font-black italic uppercase tracking-tighter">DIGITAL IMAGING</span>
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span className="text-4xl font-black italic uppercase tracking-tighter">PRODUCT STRATEGY</span>
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Product Section (Shopify) */}
      <section id="shop" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic">The Vault.</h2>
              <p className="text-neutral-500 leading-relaxed italic">Direct feed from our Shopify ecosystem. These assets are battle-tested in high-stakes urban design projects.</p>
            </div>
          </div>

          {loading ? (
             <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-indigo-500" size={48} />
              <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Querying Global Assets...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {products.map(product => (
                <div key={product.id} className="group flex flex-col h-full bg-neutral-900/10 hover:bg-neutral-900/30 p-4 transition-all border border-neutral-900 hover:border-indigo-500/30 rounded-sm">
                  <div className="aspect-[4/5] bg-neutral-950 overflow-hidden relative mb-8">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                    />
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full py-4 bg-indigo-600 text-white font-black italic uppercase tracking-tighter rounded-sm shadow-2xl"
                      >
                         Add to Vault
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black italic uppercase tracking-tighter line-clamp-1">{product.title}</h3>
                      <span className="text-xl font-black text-indigo-500">${product.price}</span>
                    </div>
                    <p className="text-neutral-500 text-xs italic line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Expertise/Features Grid */}
      <section className="bg-white text-black py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-20">
            {[
              { icon: <Monitor size={32} />, title: "PRO UI KITS", text: "Battle-tested design systems built for Figma and React, optimized for urban tech platforms." },
              { icon: <ImageIcon size={32} />, title: "RAW IMAGING", text: "High-fidelity textures and brush packs for digital imaging experts focused on urban aesthetics." },
              { icon: <Layout size={32} />, title: "PM BLUEPRINTS", text: "Strategic frameworks and product maps for managing complex digital product lifecycles." }
            ].map((feature, idx) => (
              <div key={idx} className="space-y-6">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-sm rotate-3 group hover:rotate-0 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter">{feature.title}</h4>
                <p className="text-neutral-600 leading-relaxed italic">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-neutral-950 h-full shadow-2xl border-l border-neutral-800 flex flex-col p-10 animate-in slide-in-from-right-full duration-500">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Your Vault</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:text-indigo-500 transition-colors"><X size={32} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-10 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-800 italic uppercase font-black text-2xl opacity-20"><ShoppingCart size={64} className="mb-4" /> Empty</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex space-x-6 animate-in slide-in-from-right-8 duration-300">
                    <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden rounded-sm">
                      <img src={item.image} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all cursor-crosshair" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start font-black text-xs uppercase tracking-widest italic">
                          <span className="text-neutral-500">{item.title}</span>
                          <span className="text-indigo-500">${item.price}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(idx)} className="text-[10px] text-red-500 font-black uppercase tracking-[0.4em] hover:text-white transition-colors text-left">[ DELETE ]</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-10 border-t border-neutral-900">
              <div className="flex justify-between items-end mb-10">
                <span className="text-neutral-600 font-bold uppercase tracking-widest text-[10px]">Vault Subtotal</span>
                <span className="text-5xl font-black italic tracking-tighter">${cartTotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkoutLoading}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black transition-all disabled:opacity-30 uppercase italic tracking-tighter text-xl flex items-center justify-center space-x-4 rounded-sm group overflow-hidden relative"
              >
                {checkoutLoading ? <Loader2 className="animate-spin text-white" /> : (
                  <>
                    <span className="relative z-10">SYNCHRONIZE TO CHECKOUT</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal (Same as previous) */}
      {showMockSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowMockSuccess(false)}></div>
          <div className="relative max-w-xl w-full bg-neutral-900 border border-indigo-500/20 p-16 text-center transform scale-100 transition-all rounded-sm shadow-3xl">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-600/50">
              <CreditCard size={40} className="text-white" />
            </div>
            <h2 className="text-5xl font-black italic uppercase mb-6 tracking-tighter">Vault Verified.</h2>
            <p className="text-neutral-500 mb-10 leading-relaxed italic text-lg uppercase tracking-widest">
              [ ENCRYPTION SUCCESSFUL ]
            </p>
            <p className="text-neutral-400 mb-10 leading-relaxed italic text-md">
              In a live environment, you would now be redirected to **Shopify's secure checkout and payment server** to finalize your order.
            </p>
            <button onClick={() => { setShowMockSuccess(false); setCart([]); }} className="w-full py-5 bg-indigo-600 text-white font-black uppercase italic tracking-tighter hover:bg-white hover:text-black transition-all text-lg rounded-sm">CONTINUE TO STUDIO</button>
          </div>
        </div>
      )}

      <footer className="bg-neutral-950 border-t border-neutral-900 py-20 px-6 mt-20 text-center">
        <div className="max-w-7xl mx-auto space-y-8">
           <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold -rotate-45">C</span>
            </div>
            <span className="font-bold tracking-tighter uppercase italic text-sm">CREATIVE.STUDIO</span>
          </div>
          <p className="text-[10px] font-bold text-neutral-800 uppercase tracking-[0.5em] italic">© 2026 URBAN DESIGN INFRASTRUCTURE. POWERED BY SHOPIFY INFRASTRUCTURE.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
