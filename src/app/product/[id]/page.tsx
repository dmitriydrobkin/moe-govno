// 1. Превращаем строку из базы в нормальный массив ссылок
const imagesArray = product.imageUrl ? product.imageUrl.split(',') : [];

return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    
    {/* ЛЕВАЯ СТОРОНА: ИЗОБРАЖЕНИЕ ИЛИ СЛАЙДЕР */}
    <div>
      {imagesArray.length === 0 ? (
        // Если фото нет — показываем заглушку
        <div className="w-full aspect-square bg-chocolate/5 border border-chocolate/10" />
      ) : imagesArray.length === 1 ? (
        // Если фото ОДНО — просто выводим его статично
        <img 
          src={imagesArray[0]} 
          alt={product.title} 
          className="w-full aspect-square object-cover border border-chocolate/10 shadow-sm" 
        />
      ) : (
        // ⚡️ АВТОМАТИЧЕСКИЙ НАТИВНЫЙ ТАЙЛВИНД-СЛАЙДЕР, ЕСЛИ ФОТО БОЛЬШЕ 1
        <div className="relative group">
          <div className="w-full aspect-square flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth border border-chocolate/10 shadow-sm">
            {imagesArray.map((url, index) => (
              <div 
                key={index} 
                className="w-full aspect-square flex-shrink-0 snap-start snap-always"
              >
                <img 
                  src={url} 
                  alt={`${product.title} - ракурс ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
          
          {/* Маленькая аккуратная подсказка в углу десерта/товара */}
          <div className="absolute bottom-4 right-4 bg-chocolate/80 text-cream px-3 py-1 text-xs font-sans uppercase tracking-wider backdrop-blur-sm rounded">
            Листайте ракурсы ↔
          </div>
        </div>
      )}
    </div>

    {/* ПРАВАЯ СТОРОНА: Описание, цена, кнопка купить... */}
    <div>
       <h1 className="font-serif text-3xl mb-4">{product.title}</h1>
       {/* Твой остальной код страницы товара */}
    </div>

  </div>
);
