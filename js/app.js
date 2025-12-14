document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const DATA_URL = './data/perfumes.json';
    const PLACEHOLDER_IMAGES = [
        'https://images.unsplash.com/photo-1594125311757-55b90b141159?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512777576244-b846ac3d816f?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1615160864380-6cf9548485c2?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop'
    ];

    /**
     * Fetches product data from JSON.
     */
    async function loadProducts() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            renderProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            document.getElementById('product-grid').innerHTML = `
                <div class="col-span-full text-center text-red-400">
                    <p>Lo sentimos, hubo un error cargando el catálogo.</p>
                </div>`;
        }
    }

    /**
     * Renders products into the DOM using a simple pseudo-random image strategy.
     */
    function renderProducts(data) {
        const container = document.getElementById('product-grid');
        const categoryTitle = document.getElementById('category-title');
        const categorySubtitle = document.getElementById('category-subtitle');

        // Update Section Titles
        if (categoryTitle) categoryTitle.innerText = data.categoria;
        if (categorySubtitle) categorySubtitle.innerText = `Presentación: ${data.presentacion} - Colección Exclusiva`;

        // FILTER: Keep only products with valid images
        const validProducts = data.productos.filter(p => p.imagen && p.imagen.trim().length > 5);

        if (validProducts.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center text-gray-500 italic py-10">Cargando nuevas imágenes...<br>Pronto disponible.</div>';
            return;
        }

        // Render Cards
        container.innerHTML = validProducts.map((product, index) => {

            // ALWAYS try to use the user provided image. 
            // If it fails (broken link or webpage), onerror will catch it.
            const imgUrl = (product.imagen && product.imagen.trim() !== "")
                ? product.imagen
                : PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

            return `
            <div class="product-card opacity-0 translate-y-8 bg-dark-800 border border-white/5 rounded-xl overflow-hidden hover:border-gold-500/30 transition-all duration-300 group shadow-lg shadow-black/50 flex flex-col">
                <div class="relative overflow-hidden aspect-[3/4]">
                     <div class="absolute inset-0 bg-gray-800 animate-pulse loading-placeholder -z-10"></div>
                     <!-- Image with Auto-Fallback -->
                     <img src="${imgUrl}" 
                          alt="${product.nombre}" 
                          onerror="this.onerror=null; this.src='https://placehold.co/600x800/1a1a1a/FFF?text=IMG+Error';"
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100">
                     <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
                     
                     <div class="absolute bottom-4 left-4 right-4 z-10">
                        <span class="inline-block px-2 py-1 mb-2 text-[10px] font-bold tracking-wit text-dark-900 bg-gold-400 rounded-sm uppercase">
                            ${(product.genero) ? product.genero : data.presentacion}
                        </span>
                        <h3 class="text-xl font-serif text-white font-medium leading-tight">${product.nombre}</h3>
                     </div>
                </div>
                
                <div class="p-4 flex items-center justify-between bg-dark-700/30 flex-grow mt-auto border-t border-white/5">
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wider">Marca</p>
                        <p class="text-sm text-gold-200 font-semibold">${product.marca}</p>
                    </div>
                    <button class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-dark-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
            `;
        }).join('');

        // Trigger Animations after render
        animateEntrance();
    }

    /**
     * Animations using Anime.js
     */
    function animateEntrance() {
        // Hero Animation
        anime({
            targets: '.hero-element',
            translateY: [30, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1500,
            delay: anime.stagger(200, { start: 300 })
        });

        // Grid Animation (Observer)
        const grid = document.getElementById('product-grid');
        if (grid) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        anime({
                            targets: '#product-grid .product-card',
                            translateY: [50, 0],
                            opacity: [0, 1],
                            easing: 'easeOutExpo',
                            duration: 1000,
                            delay: anime.stagger(100)
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(grid);
        }
    }

    // Initialize
    loadProducts();
});
