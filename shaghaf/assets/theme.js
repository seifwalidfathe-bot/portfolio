/**
 * Shaghaf Store Egypt - Core Theme Engine (Online Store 2.0)
 * Built for Egyptian E-Commerce, 1-Click COD Funnel, Custom Accessories & WhatsApp Commerce
 */

(function () {
  'use strict';

  // Egyptian Governorates Shipping Rates Matrix (EGP)
  const EGYPT_GOVERNORATES = {
    cairo: { name: 'القاهرة', name_en: 'Cairo', rate: 45, zone: 'central' },
    giza: { name: 'الجيزة', name_en: 'Giza', rate: 45, zone: 'central' },
    alexandria: { name: 'الإسكندرية', name_en: 'Alexandria', rate: 55, zone: 'coastal' },
    port_said: { name: 'بورسعيد', name_en: 'Port Said', rate: 55, zone: 'canal' },
    suez: { name: 'السويس', name_en: 'Suez', rate: 55, zone: 'canal' },
    ismailia: { name: 'الإسماعيلية', name_en: 'Ismailia', rate: 55, zone: 'canal' },
    qalyubia: { name: 'القليوبية', name_en: 'Qalyubia', rate: 55, zone: 'delta' },
    sharqia: { name: 'الشرقية', name_en: 'Sharqia', rate: 60, zone: 'delta' },
    dakahlia: { name: 'الدقهلية (المنصورة)', name_en: 'Dakahlia', rate: 60, zone: 'delta' },
    gharbia: { name: 'الغربية (طنطا)', name_en: 'Gharbia', rate: 60, zone: 'delta' },
    monufia: { name: 'المنوفية', name_en: 'Monufia', rate: 60, zone: 'delta' },
    beheira: { name: 'البحيرة (دمنهور)', name_en: 'Beheira', rate: 60, zone: 'delta' },
    damietta: { name: 'دمياط', name_en: 'Damietta', rate: 60, zone: 'delta' },
    kafr_el_sheikh: { name: 'كفر الشيخ', name_en: 'Kafr El Sheikh', rate: 60, zone: 'delta' },
    faiyum: { name: 'الفيوم', name_en: 'Faiyum', rate: 65, zone: 'upper_egypt' },
    beni_suef: { name: 'بني سويف', name_en: 'Beni Suef', rate: 65, zone: 'upper_egypt' },
    minya: { name: 'المنيا', name_en: 'Minya', rate: 75, zone: 'upper_egypt' },
    asyut: { name: 'أسيوط', name_en: 'Asyut', rate: 75, zone: 'upper_egypt' },
    sohag: { name: 'سوهاج', name_en: 'Sohag', rate: 75, zone: 'upper_egypt' },
    qena: { name: 'قنا', name_en: 'Qena', rate: 80, zone: 'upper_egypt' },
    luxor: { name: 'الأقصر', name_en: 'Luxor', rate: 80, zone: 'upper_egypt' },
    aswan: { name: 'أسوان', name_en: 'Aswan', rate: 85, zone: 'upper_egypt' },
    red_sea: { name: 'البحر الأحمر (الغردقة)', name_en: 'Red Sea', rate: 95, zone: 'frontier' },
    matrouh: { name: 'مطروح والساحل الشمالي', name_en: 'Matrouh', rate: 95, zone: 'frontier' },
    south_sinai: { name: 'جنوب سيناء (شرم الشيخ / دهب)', name_en: 'South Sinai', rate: 95, zone: 'frontier' },
    north_sinai: { name: 'شمال سيناء (العريش)', name_en: 'North Sinai', rate: 95, zone: 'frontier' },
    new_valley: { name: 'الوادي الجديد', name_en: 'New Valley', rate: 95, zone: 'frontier' }
  };

  const DEFAULT_DEPOSIT_PER_CUSTOM_ITEM = 50; // EGP

  // Storefront Global State
  window.ShaghafTheme = {
    cart: { items: [], total_price: 0, item_count: 0 },
    currentProduct: null,
    selectedGovernorate: 'cairo',
    whatsappNumber: '201065052442',
    instapayHandle: 'shaghaf@instapay',
    vodafoneCash: '01065052442',
    
    // Core Methods
    init: function () {
      this.bindHeader();
      this.bindCartDrawer();
      this.bindPDPPersonalization();
      this.bindFastCheckoutModal();
      this.bindStickyAddToCart();
      this.populateGovernorateSelects();
      this.fetchCart();
    },

    // Populate Governorate Select Dropdowns across Storefront
    populateGovernorateSelects: function () {
      const selects = document.querySelectorAll('[data-egypt-governorates]');
      selects.forEach(select => {
        const currentVal = select.value || 'cairo';
        select.innerHTML = '';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- اختر المحافظة لحساب الشحن --';
        select.appendChild(defaultOption);

        for (const [key, gov] of Object.entries(EGYPT_GOVERNORATES)) {
          const opt = document.createElement('option');
          opt.value = key;
          opt.textContent = `${gov.name} (${gov.rate} ج.م)`;
          if (key === currentVal) opt.selected = true;
          select.appendChild(opt);
        }

        select.addEventListener('change', (e) => {
          this.selectedGovernorate = e.target.value;
          this.updateOrderSummary();
        });
      });
    },

    // Header & Mobile Nav
    bindHeader: function () {
      const header = document.querySelector('.site-header');
      if (header) {
        window.addEventListener('scroll', () => {
          if (window.scrollY > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }, { passive: true });
      }

      // Mobile Menu Drawer Toggle
      const mobileMenuBtn = document.querySelector('[data-toggle-mobile-menu]');
      const mobileDrawer = document.querySelector('[data-mobile-menu-drawer]');
      if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
          mobileDrawer.classList.toggle('active');
        });
      }
    },

    // PDP Customization & Personalization Engine (R3)
    bindPDPPersonalization: function () {
      const form = document.querySelector('[data-pdp-custom-form]');
      if (!form) return;

      const engravingInput = form.querySelector('[data-engraving-input]');
      const engravingPreview = form.querySelector('[data-engraving-preview-text]');
      const fontRadios = form.querySelectorAll('input[name="properties[شكل الخط]"]');
      const photoInput = form.querySelector('[data-photo-upload-input]');
      const photoHint = form.querySelector('[data-photo-filename]');
      const giftBoxCheckbox = form.querySelector('[data-gift-box-checkbox]');
      const basePriceElem = document.querySelector('[data-base-price]');

      // Live Engraving Preview
      if (engravingInput && engravingPreview) {
        engravingInput.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          engravingPreview.textContent = val.length > 0 ? val : 'معاينة الاسم هنا';
        });
      }

      // Font Style Preview Changes
      fontRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (engravingPreview) {
            engravingPreview.setAttribute('data-font-style', radio.value);
            if (radio.value.includes('رقعة')) {
              engravingPreview.style.fontFamily = "'Cairo', cursive";
            } else if (radio.value.includes('ديواني')) {
              engravingPreview.style.fontFamily = "'Amiri', 'Cairo', serif";
            } else if (radio.value.includes('Cursive')) {
              engravingPreview.style.fontFamily = "'Brush Script MT', cursive";
            } else {
              engravingPreview.style.fontFamily = "'Inter', sans-serif";
            }
          }
        });
      });

      // Photo Upload Display
      if (photoInput && photoHint) {
        photoInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            photoHint.textContent = `تم اختيار: ${fileName} (${Math.round(e.target.files[0].size / 1024)} KB)`;
            photoHint.style.color = 'var(--color-accent-green)';
            photoHint.style.fontWeight = '700';
          }
        });
      }

      // Gift Box Price Toggle (+45 EGP)
      if (giftBoxCheckbox && basePriceElem) {
        const originalBase = parseInt(basePriceElem.getAttribute('data-raw-price') || '0', 10);
        giftBoxCheckbox.addEventListener('change', (e) => {
          const newPrice = e.target.checked ? originalBase + 45 : originalBase;
          basePriceElem.textContent = `${newPrice} ج.م`;
          this.updateOrderSummary();
        });
      }

      // Variant Buttons
      const variantBtns = form.querySelectorAll('[data-variant-btn]');
      variantBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const group = btn.closest('.variant-options-flex');
          group.querySelectorAll('[data-variant-btn]').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          
          const hiddenInput = group.querySelector('input[type="hidden"]');
          if (hiddenInput) hiddenInput.value = btn.getAttribute('data-value');
        });
      });

      // WhatsApp Dedicated PDP Button (R5)
      const waPdpBtn = document.querySelector('[data-order-whatsapp-pdp]');
      if (waPdpBtn) {
        waPdpBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.sendProductWhatsAppOrder();
        });
      }

      // Add to Bag / Custom Order Submission
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddToCart(form);
      });

      // 1-Click Fast COD Button
      const fastCodBtn = document.querySelector('[data-open-fast-checkout]');
      if (fastCodBtn) {
        fastCodBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openFastCheckoutModal();
        });
      }
    },

    // Add to Cart AJAX Handler
    handleAddToCart: function (form) {
      const formData = new FormData(form);
      const titleElem = document.querySelector('.pdp-title');
      const priceElem = document.querySelector('[data-base-price]');
      const imgElem = document.querySelector('.pdp-gallery-main img');

      const newItem = {
        id: Date.now(),
        title: titleElem ? titleElem.textContent.trim() : 'قطعة إكسسوار مخصصة',
        price: priceElem ? parseInt(priceElem.textContent.replace(/[^0-9]/g, ''), 10) : 350,
        image: imgElem ? imgElem.src : '',
        quantity: 1,
        properties: {
          'الاسم للنقش': formData.get('properties[الاسم للنقش]') || 'بدون نقش',
          'شكل الخط': formData.get('properties[شكل الخط]') || 'رقعة عربي',
          'الخامة': formData.get('properties[الخامة]') || 'ستانلس ستيل 316L مطلي ذهب',
          'ملاحظات إضافية': formData.get('properties[ملاحظات إضافية]') || 'لا يوجد',
          'تغليف هدية': formData.get('properties[تغليف هدية]') ? 'نعم (+45 ج.م)' : 'عادي'
        }
      };

      this.cart.items.push(newItem);
      this.cart.item_count += 1;
      this.cart.total_price += newItem.price;

      this.updateCartUI();
      this.openCartDrawer();
    },

    // Cart Drawer Open/Close & Calculations (R6)
    bindCartDrawer: function () {
      const overlay = document.querySelector('[data-cart-drawer-overlay]');
      const triggers = document.querySelectorAll('[data-open-cart-drawer]');
      const closeBtns = document.querySelectorAll('[data-close-cart-drawer]');

      triggers.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCartDrawer();
      }));

      closeBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeCartDrawer();
      }));

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.closeCartDrawer();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeCartDrawer();
          this.closeFastCheckoutModal();
        }
      });
    },

    openCartDrawer: function () {
      const overlay = document.querySelector('[data-cart-drawer-overlay]');
      if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    closeCartDrawer: function () {
      const overlay = document.querySelector('[data-cart-drawer-overlay]');
      if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    fetchCart: function () {
      // Mock / Local Initial State for Custom Accessories
      if (this.cart.items.length === 0) {
        this.cart = {
          items: [
            {
              id: 101,
              title: "سلسلة تفصيل بالاسم والخط الديواني - مطلية ذهب 18",
              price: 380,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
              properties: {
                "الاسم للنقش": "نورهان",
                "شكل الخط": "خط ديواني مميز",
                "الخامة": "ستانلس ستيل 316L مقاوم للصدأ",
                "تغليف هدية": "نعم (+45 ج.م)"
              }
            }
          ],
          total_price: 380,
          item_count: 1
        };
      }
      this.updateCartUI();
    },

    updateCartUI: function () {
      // Update badge counts
      const badges = document.querySelectorAll('[data-cart-count]');
      badges.forEach(b => b.textContent = this.cart.item_count);

      const itemsContainer = document.querySelector('[data-cart-drawer-items]');
      if (!itemsContainer) return;

      if (this.cart.items.length === 0) {
        itemsContainer.innerHTML = `
          <div style="text-align:center; padding: 3rem 1rem;">
            <p style="font-weight:700; color:var(--color-text-muted); margin-bottom:1rem;">سلة مشترياتك فارغة حالياً</p>
            <a href="/#products" class="btn btn-accent" data-close-cart-drawer>استعرض القطع وتفصيل الأسماء</a>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = this.cart.items.map((item, idx) => `
          <div class="cart-item-row" data-item-index="${idx}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-thumb">
            <div class="cart-item-info">
              <div>
                <h4 style="font-size:0.92rem; font-weight:700; line-height:1.3; margin-bottom:0.25rem;">${item.title}</h4>
                <div style="font-size:0.78rem; color:var(--color-text-muted); line-height:1.4;">
                  ${Object.entries(item.properties || {}).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('')}
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
                <span class="numeral" style="font-weight:800; color:var(--color-text-primary);">${item.price} ج.م</span>
                <button type="button" style="background:none; border:none; color:var(--color-accent-terracotta); font-size:0.8rem; cursor:pointer;" onclick="window.ShaghafTheme.removeItem(${idx})">حذف</button>
              </div>
            </div>
          </div>
        `).join('');
      }

      this.updateOrderSummary();
    },

    removeItem: function (idx) {
      if (this.cart.items[idx]) {
        this.cart.total_price -= this.cart.items[idx].price;
        this.cart.item_count -= 1;
        this.cart.items.splice(idx, 1);
        this.updateCartUI();
      }
    },

    // Governorate Shipping & Deposit Calculation Engine (R4 & R6)
    updateOrderSummary: function () {
      const govKey = this.selectedGovernorate || 'cairo';
      const govData = EGYPT_GOVERNORATES[govKey] || EGYPT_GOVERNORATES.cairo;
      const shippingRate = govData.rate;

      const subtotal = this.cart.total_price;
      const totalOrder = subtotal + shippingRate;
      const depositDue = Math.min(subtotal, this.cart.items.length * DEFAULT_DEPOSIT_PER_CUSTOM_ITEM);
      const balanceOnDelivery = totalOrder - depositDue;

      // Update in Cart Drawer
      const cartSubtotalElem = document.querySelector('[data-cart-subtotal]');
      const cartShippingElem = document.querySelector('[data-cart-shipping]');
      const cartDepositElem = document.querySelector('[data-cart-deposit]');
      const cartBalanceElem = document.querySelector('[data-cart-balance]');
      const cartTotalElem = document.querySelector('[data-cart-total]');

      if (cartSubtotalElem) cartSubtotalElem.textContent = `${subtotal} ج.م`;
      if (cartShippingElem) cartShippingElem.textContent = `${shippingRate} ج.م (${govData.name})`;
      if (cartDepositElem) cartDepositElem.textContent = `${depositDue} ج.م`;
      if (cartBalanceElem) cartBalanceElem.textContent = `${balanceOnDelivery} ج.م`;
      if (cartTotalElem) cartTotalElem.textContent = `${totalOrder} ج.م`;

      // Update in Fast Checkout Modal
      const modalSubtotal = document.querySelector('[data-modal-subtotal]');
      const modalShipping = document.querySelector('[data-modal-shipping]');
      const modalDeposit = document.querySelector('[data-modal-deposit]');
      const modalBalance = document.querySelector('[data-modal-balance]');
      const modalTotal = document.querySelector('[data-modal-total]');

      if (modalSubtotal) modalSubtotal.textContent = `${subtotal} ج.م`;
      if (modalShipping) modalShipping.textContent = `${shippingRate} ج.م`;
      if (modalDeposit) modalDeposit.textContent = `${depositDue} ج.م`;
      if (modalBalance) modalBalance.textContent = `${balanceOnDelivery} ج.م`;
      if (modalTotal) modalTotal.textContent = `${totalOrder} ج.م`;
    },

    // Fast 4-Field Checkout Modal (R4)
    bindFastCheckoutModal: function () {
      const overlay = document.querySelector('[data-fast-checkout-overlay]');
      const closeBtn = document.querySelector('[data-close-fast-checkout]');
      const form = document.querySelector('[data-fast-checkout-form]');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeFastCheckoutModal());
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.closeFastCheckoutModal();
        });
      }

      if (form) {
        // Egyptian 11-digit Phone validation: 010, 011, 012, 015
        const phoneInput = form.querySelector('[name="customer_phone"]');
        const phoneError = form.querySelector('[data-phone-error]');

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const phoneVal = phoneInput ? phoneInput.value.trim().replace(/\s+/g, '') : '';
          const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

          if (!egyptPhoneRegex.test(phoneVal)) {
            if (phoneError) {
              phoneError.textContent = 'يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقماً (مثال: 01065052442)';
              phoneError.style.display = 'block';
            }
            if (phoneInput) phoneInput.focus();
            return;
          } else {
            if (phoneError) phoneError.style.display = 'none';
          }

          this.processFastCheckout(form);
        });
      }
    },

    openFastCheckoutModal: function () {
      this.closeCartDrawer();
      const overlay = document.querySelector('[data-fast-checkout-overlay]');
      if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateOrderSummary();
      }
    },

    closeFastCheckoutModal: function () {
      const overlay = document.querySelector('[data-fast-checkout-overlay]');
      if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    processFastCheckout: function (form) {
      const formData = new FormData(form);
      const name = formData.get('customer_name');
      const phone = formData.get('customer_phone');
      const govKey = formData.get('customer_governorate') || this.selectedGovernorate;
      const govData = EGYPT_GOVERNORATES[govKey] || EGYPT_GOVERNORATES.cairo;
      const address = formData.get('customer_address');
      const walletMethod = formData.get('deposit_method') || 'انستاباي (InstaPay)';

      const subtotal = this.cart.total_price;
      const shipping = govData.rate;
      const total = subtotal + shipping;
      const deposit = Math.min(subtotal, this.cart.items.length * DEFAULT_DEPOSIT_PER_CUSTOM_ITEM);
      const balance = total - deposit;

      // Construct WhatsApp Confirmation Message
      let waMessage = `✨ *طلب قطعة تفصيل مخصصة - شغف ستور مصر*\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `👤 *الاسم:* ${name}\n`;
      waMessage += `📱 *الموبايل:* ${phone}\n`;
      waMessage += `📍 *المحافظة:* ${govData.name}\n`;
      waMessage += `🏠 *العنوان:* ${address}\n`;
      waMessage += `💳 *طريقة دفع العربون:* ${walletMethod}\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📦 *القطع المطلوبة:*\n`;

      this.cart.items.forEach((item, idx) => {
        waMessage += `${idx + 1}. *${item.title}* (${item.price} ج.م)\n`;
        if (item.properties) {
          Object.entries(item.properties).forEach(([k, v]) => {
            waMessage += `   • ${k}: ${v}\n`;
          });
        }
      });

      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `💵 *سعر القطع:* ${subtotal} ج.م\n`;
      waMessage += `🚚 *مصاريف الشحن:* ${shipping} ج.م\n`;
      waMessage += `💰 *الإجمالي الكلي:* ${total} ج.م\n`;
      waMessage += `🔒 *عربون التأكيد المطلوب:* ${deposit} ج.م (${walletMethod})\n`;
      waMessage += `🤝 *المتبقي عند الاستلام بعد المعاينة:* ${balance} ج.م\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `ملاحظة: بانتظار تأكيدك وبيانات التحويل لإرسال بروفة التصميم فوراً.`;

      const targetUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
      
      // Visual Feedback
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = `<span>جاري تحويلك لتأكيد الطلب على واتساب...</span>`;
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        window.open(targetUrl, '_blank');
        this.closeFastCheckoutModal();
        alert('شكراً لطلبك من شغف ستور! تم فتح المحادثة على واتساب لمراجعة بروفة التصميم وسداد العربون.');
        if (submitBtn) {
          submitBtn.innerHTML = `<span>تأكيد الطلب وبدء التفصيل</span>`;
          submitBtn.disabled = false;
        }
      }, 600);
    },

    // Dedicated Product WhatsApp Direct Order (R5)
    sendProductWhatsAppOrder: function () {
      const form = document.querySelector('[data-pdp-custom-form]');
      const titleElem = document.querySelector('.pdp-title');
      const priceElem = document.querySelector('[data-base-price]');
      const title = titleElem ? titleElem.textContent.trim() : 'قطعة إكسسوار مخصصة';
      const price = priceElem ? priceElem.textContent.trim() : '350 ج.م';

      let engraving = 'بدون نقش';
      let fontStyle = 'رقعة عربي';
      let metal = 'ستانلس ستيل 316L';
      let notes = 'لا يوجد';

      if (form) {
        const formData = new FormData(form);
        engraving = formData.get('properties[الاسم للنقش]') || engraving;
        fontStyle = formData.get('properties[شكل الخط]') || fontStyle;
        metal = formData.get('properties[الخامة]') || metal;
        notes = formData.get('properties[ملاحظات إضافية]') || notes;
      }

      let waText = `مرحباً شغف ستور مصر 👋\nأود تفصيل وطلب القطعة التالية:\n\n`;
      waText += `✨ *القطعة:* ${title}\n`;
      waText += `✍️ *الاسم للنقش:* ${engraving}\n`;
      waText += `🖋️ *نوع الخط:* ${fontStyle}\n`;
      waText += `💎 *الخامة:* ${metal}\n`;
      waText += `📝 *ملاحظات:* ${notes}\n`;
      waText += `💰 *السعر:* ${price}\n`;
      waText += `🔗 *الرابط:* ${window.location.href}\n\n`;
      waText += `برجاء إرسال تفاصيل دفع العربون (انستاباي / فودافون كاش) وبروفة التصميم.`;

      const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(waText)}`;
      window.open(url, '_blank');
    },

    // Mobile Sticky Add-to-Cart (R6)
    bindStickyAddToCart: function () {
      const stickyBar = document.querySelector('[data-mobile-sticky-bar]');
      const triggerBtn = document.querySelector('[data-main-add-to-cart]');

      if (!stickyBar || !triggerBtn) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // If the main CTA button is NOT intersecting (scrolled past), show sticky bar
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            stickyBar.classList.add('visible');
          } else {
            stickyBar.classList.remove('visible');
          }
        });
      }, { threshold: 0.1 });

      observer.observe(triggerBtn);

      // Sticky button clicks trigger Fast Checkout
      const stickyActionBtn = stickyBar.querySelector('[data-sticky-action-btn]');
      if (stickyActionBtn) {
        stickyActionBtn.addEventListener('click', () => {
          this.openFastCheckoutModal();
        });
      }
    }
  };

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.ShaghafTheme.init());
  } else {
    window.ShaghafTheme.init();
  }
})();
