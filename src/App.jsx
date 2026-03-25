import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ArrowRight, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { fetchStorefront, FETCH_PRODUCTS_QUERY, CHECKOUT_CREATE_MUTATION } from './lib/shopify';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

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
    try {
      setCheckoutLoading(true);
      const lineItems = cart.map(item => ({
        variantId: item.variantId,
        quantity: 1
      }));

      const result = await fetchStorefront(CHECKOUT_CREATE_MUTATION, {
        input: { lineItems }
      });

      if (result?.data?.checkoutCreate?.checkout?.webUrl) {
        // Redirect to Shopify Checkout
        window.location.href = result.data.checkoutCreate.checkout.webUrl;
      } else {
        const errors = result?.data?.checkoutCreate?.checkoutUserErrors || [];
        console.error("Checkout errors:", errors);
        alert("Checkout failed. Check console for details.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to create checkout. Is your API token correct?");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center">
              <span className="text-white font-bold -rotate-45">C</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">HYDROGEN.MOCK</span>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-neutral-800 rounded-full transition-colors group"
            >
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
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8">
            <Zap size={14} />
            <span>LIVE SHOPIFY SIMULATION LOADED</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter mb-12 italic uppercase">
            MOCK <br /> <span className="text-indigo-600">CHECKOUT.</span>
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience the full Shopify flow: from a custom React storefront to a live checkout redirect using the Hydrogen Preview Store.
          </p>
          <button 
            onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 bg-white text-black font-black flex items-center space-x-3 mx-auto hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1 rounded-sm"
          >
            <span>START SIMULATION</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section id="shop" className="py-24 px-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-indigo-500" size={48} />
              <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs">Querying Storefront API...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-20 font-bold">{error}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="group relative bg-neutral-900 border border-neutral-800 p-2 hover:border-indigo-500/50 transition-all flex flex-col">
                  <div className="aspect-square bg-neutral-950 overflow-hidden relative mb-4">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => addToCart(product)}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold flex items-center space-x-2 rounded-sm"
                      >
                        <ShoppingCart size={18} />
                        <span>ADD</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-2 space-y-2 flex-grow flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-black uppercase truncate pr-4">{product.title}</h3>
                      <span className="text-sm font-black text-indigo-500">${product.price}</span>
                    </div>
                    <p className="text-[10px] text-neutral-500 line-clamp-3 leading-relaxed flex-grow">
                      {product.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Drawer & Checkout Logic */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-neutral-950 h-full shadow-2xl border-l border-neutral-800 flex flex-col">
            <div className="p-8 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Your Vault</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                  <ShoppingCart size={64} className="opacity-10" />
                  <p className="font-bold tracking-widest uppercase text-xs">The vault is empty</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex space-x-6 group animate-in slide-in-from-right-8 duration-300">
                    <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden">
                      <img src={item.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start font-black text-sm uppercase">
                        <span>{item.title}</span>
                        <span className="text-indigo-500">${item.price}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(idx)}
                        className="text-[10px] text-red-500 font-bold mt-4 uppercase tracking-[0.2em] hover:text-white transition-colors"
                      >
                        [ REMOVE ]
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-8 border-t border-neutral-800 bg-neutral-900/50">
              <div className="flex justify-between items-center mb-8">
                <span className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Estimated Total</span>
                <span className="text-3xl font-black">${cartTotal}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkoutLoading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black transition-all disabled:opacity-30 disabled:grayscale uppercase italic tracking-tighter text-lg flex items-center justify-center space-x-3"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>SYNCHRONIZING...</span>
                  </>
                ) : (
                  <>
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
              <div className="mt-6 flex items-center justify-center space-x-3 text-neutral-600">
                <CheckCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Shopify Backbone</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold -rotate-45">C</span>
            </div>
            <span className="font-bold tracking-tighter uppercase italic text-sm">HYDROGEN.PREVIEW</span>
          </div>
          <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-[0.3em]">
            SIMULATION MODE ENABLED © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
