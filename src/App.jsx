import React, { useState } from 'react';
import { ShoppingCart, Menu, X, ArrowRight, Zap, Monitor, Layout, Image as ImageIcon, CheckCircle } from 'lucide-react';

const GEMINI_MODELS = ['gemini-3-flash-preview','gemini-2.0-flash','gemini-1.5-flash'];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const products = [
    {
      id: 1,
      name: "Neo-Urban UI Kit",
      category: "UI Design",
      price: 49,
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
      description: "A comprehensive design system for urban-themed digital products."
    },
    {
      id: 2,
      name: "Cyberpunk Textures",
      category: "Digital Imaging",
      price: 25,
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
      description: "High-resolution overlays for gritty, urban digital imaging."
    },
    {
      id: 3,
      name: "Modular Grid System",
      category: "UI Design",
      price: 35,
      image: "https://images.unsplash.com/photo-1581291518066-8e25010b4f6b?auto=format&fit=crop&q=80&w=800",
      description: "The perfect layout foundation for complex dashboards."
    },
    {
      id: 4,
      name: "Brutalist Poster Templates",
      category: "Graphic Design",
      price: 19,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
      description: "Raw, impactful designs for urban events and streetwear brands."
    },
    {
      id: 5,
      name: "Mobile App Wireframe Kit",
      category: "UI Design",
      price: 55,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
      description: "Ready-to-use components for rapid digital product prototyping."
    },
    {
      id: 6,
      name: "Streetwear Brand Identity",
      category: "Urban Design",
      price: 89,
      image: "https://images.unsplash.com/photo-1523381235312-3a1647fa9921?auto=format&fit=crop&q=80&w=800",
      description: "A complete visual system for urban fashion startups."
    }
  ];

  const categories = ['All', 'UI Design', 'Digital Imaging', 'Graphic Design', 'Urban Design'];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveCategory('All')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center">
              <span className="text-white font-bold -rotate-45">C</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">CREATIVE.STUDIO</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`hover:text-indigo-400 transition-colors ${activeCategory === cat ? 'text-indigo-500' : 'text-neutral-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-neutral-800 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-8 space-y-4">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setIsMenuOpen(false); }}
                className="block w-full text-left text-lg font-medium text-neutral-400 hover:text-indigo-500 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                <Zap size={14} />
                <span>NEW ASSETS RELEASED WEEKLY</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                DESIGN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">SYSTEMS</span> <br /> FOR THE CITY.
              </h1>
              <p className="text-xl text-neutral-400 max-w-lg mb-10 leading-relaxed">
                Premium UI kits, urban textures, and digital product assets curated for professionals. Elevate your creative workflow.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-white text-black font-bold flex items-center space-x-2 hover:bg-indigo-500 hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <span>SHOP COLLECTIONS</span>
                  <ArrowRight size={18} />
                </button>
                <button className="px-8 py-4 border border-neutral-700 font-bold hover:bg-neutral-800 transition-all">
                  VIEW PORTFOLIO
                </button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-xl blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
              <div className="relative aspect-square bg-neutral-900 border border-neutral-800 overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Creative Workspace"
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-lg">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-indigo-400 font-bold mb-1">FEATURED PROJECT</p>
                      <h3 className="text-lg font-bold">Urban Vision 2.0</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Status</p>
                      <p className="text-xs font-bold text-green-400">Available Now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Bars */}
      <section className="bg-neutral-900 border-y border-neutral-800 py-12 overflow-hidden">
        <div className="flex items-center">
          <div className="animate-marquee whitespace-nowrap space-x-12">
            {[1,2,3,4,5,6].map(i => (
              <React.Fragment key={i}>
                <span className="text-2xl font-black text-neutral-700">UI DESIGN</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="text-2xl font-black text-neutral-700">DIGITAL IMAGING</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="text-2xl font-black text-neutral-700">PRODUCT MANAGEMENT</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="text-2xl font-black text-neutral-700">URBAN BRANDING</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic">The Vault</h2>
              <p className="text-neutral-500 max-w-sm">Curated assets for modern digital imaging and product design professionals.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold border transition-all ${
                    activeCategory === cat 
                      ? 'bg-white text-black border-white' 
                      : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group relative flex flex-col h-full">
                <div className="aspect-[4/3] bg-neutral-900 border border-neutral-800 overflow-hidden relative mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => addToCart(product)}
                      className="px-6 py-3 bg-indigo-600 text-white font-bold flex items-center space-x-2 rounded-sm"
                    >
                      <ShoppingCart size={18} />
                      <span>ADD TO CART</span>
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <span className="text-xl font-black text-indigo-500">${product.price}</span>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed flex-grow">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white text-black py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-sm">
                <Monitor size={24} />
              </div>
              <h4 className="text-xl font-black">PRO UI KITS</h4>
              <p className="text-neutral-600 leading-relaxed">Battle-tested design systems built for Figma and React, optimized for urban tech platforms.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-sm">
                <ImageIcon size={24} />
              </div>
              <h4 className="text-xl font-black">RAW IMAGING</h4>
              <p className="text-neutral-600 leading-relaxed">High-fidelity textures and brush packs for digital imaging experts focused on urban aesthetics.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-sm">
                <Layout size={24} />
              </div>
              <h4 className="text-xl font-black">PM BLUEPRINTS</h4>
              <p className="text-neutral-600 leading-relaxed">Strategic frameworks and product maps for managing complex digital product lifecycles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-neutral-950 h-full shadow-2xl border-l border-neutral-800 flex flex-col">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-xl font-black">YOUR CART ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p>Your vault is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-indigo-500 font-bold hover:underline"
                  >
                    Start collecting assets
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex space-x-4 animate-in fade-in slide-in-from-right-4">
                    <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between font-bold text-sm">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{item.category}</p>
                      <button 
                        onClick={() => removeFromCart(idx)}
                        className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-widest hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-neutral-400 font-medium">SUBTOTAL</span>
                <span className="text-2xl font-black">${cartTotal}</span>
              </div>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={cart.length === 0}>
                PROCEED TO CHECKOUT
              </button>
              <p className="text-[10px] text-neutral-500 text-center mt-4 tracking-widest uppercase">
                Secure checkout powered by Shopify
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-6 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold -rotate-45">C</span>
                </div>
                <span className="font-bold tracking-tighter">CREATIVE.STUDIO</span>
              </div>
              <p className="text-neutral-500 max-w-sm mb-8">
                Building the visual infrastructure for urban digital brands. From UI kits to brand identities, we deliver excellence for professionals.
              </p>
              <div className="flex space-x-4">
                {['TWITTER', 'INSTAGRAM', 'DRIBBBLE', 'LINKEDIN'].map(social => (
                  <a key={social} href="#" className="text-xs font-bold text-neutral-400 hover:text-white transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-sm tracking-widest uppercase">Explore</h5>
              <ul className="space-y-4 text-sm text-neutral-500">
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Digital Assets</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">UI Design Kits</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Urban Textures</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Service Packages</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-sm tracking-widest uppercase">Support</h5>
              <ul className="space-y-4 text-sm text-neutral-500">
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">License Agreement</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Contact Support</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Refund Policy</li>
                <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-neutral-600 tracking-widest uppercase">
            <span>© 2026 CREATIVE STUDIO CO. POWERED BY SHOPIFY.</span>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <CheckCircle size={12} className="text-green-500" />
                <span>PCI COMPLIANT</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle size={12} className="text-green-500" />
                <span>SSL SECURE</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
