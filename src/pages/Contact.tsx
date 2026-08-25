import { useState } from 'react';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto pt-32 pb-24 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Aloqa</h1>
        <p className="text-gray-500">Savollaringiz bormi? Biz bilan bog'laning!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-semibold mb-6">Bizning manzil</h3>
          <div className="space-y-6 text-gray-600">
            <div>
              <p>Toshkent shahri, Yunusobod tumani</p>
              <p>Amir Temur shoh ko'chasi, 1-uy</p>
            </div>
            <div className="space-y-3">
              <a href="tel:+998904380888" className="flex items-center gap-3 font-medium text-black hover:text-gray-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                +998 90 438 08 88
              </a>
              <a href="https://t.me/etomodauz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-medium text-black hover:text-[#0088cc] transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.676c.223-.198-.05-.31-.346-.11l-6.4 4.03-2.76-.86c-.6-.184-.614-.602.125-.89l10.796-4.16c.5-.184.954.116.805.91z"/></svg>
                </div>
                @etomodauz
              </a>
              <a href="https://instagram.com/etomoda_uz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-medium text-black hover:text-[#E1306C] transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                etomoda_uz
              </a>
              <a href="mailto:info@etomoda.uz" className="flex items-center gap-3 font-medium text-black hover:text-gray-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                info@etomoda.uz
              </a>
            </div>
            <div className="pt-4 border-t border-black/5">
              <p className="text-sm font-medium mb-2">Ish vaqti:</p>
              <p className="text-sm text-gray-500">Dushanba - Shanba: 09:00 - 20:00</p>
              <p className="text-sm text-gray-500">Yakshanba: Dam olish kuni</p>
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="bg-green-50 text-green-700 p-8 rounded-3xl text-center">
              <h3 className="text-xl font-bold mb-2">Xabaringiz yuborildi!</h3>
              <p>Tez orada siz bilan bog'lanamiz.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-black/5">
              <div>
                <label className="block text-sm font-medium mb-1">Ismingiz</label>
                <input required type="text" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3" placeholder="Sardor" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon raqam / Email</label>
                <input required type="text" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3" placeholder="+998..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Xabar</label>
                <textarea required className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 h-32 resize-none" placeholder="Xabaringizni yozing..."></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-800 transition-colors">
                Yuborish
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
