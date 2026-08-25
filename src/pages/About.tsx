export function About() {
  return (
    <div className="max-w-4xl mx-auto pt-32 pb-24 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Biz haqimizda</h1>
      <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
        ETOMODA - zamonaviy uslub va sifatni qadrlovchilar uchun maxsus yaratilgan do'kon. 
        Bizning maqsadimiz har bir mijozga o'ziga xos stlini topishda yordam berish va 
        eng so'nggi urfdagi kiyimlarni taqdim etish.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
          <h3 className="text-xl font-semibold mb-4">Sifat</h3>
          <p className="text-gray-500 text-sm">Biz faqat eng yaxshi materiallardan tayyorlangan mahsulotlarni taklif etamiz.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
          <h3 className="text-xl font-semibold mb-4">Uslub</h3>
          <p className="text-gray-500 text-sm">Jahon modasi tendensiyalarini kuzatib boramiz va eng so'nggi modellarni olib kelamiz.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
          <h3 className="text-xl font-semibold mb-4">Mijozlar</h3>
          <p className="text-gray-500 text-sm">Sizning mamnunligingiz biz uchun eng muhimi. Xizmat sifatini doim oshirib boramiz.</p>
        </div>
      </div>
    </div>
  );
}
