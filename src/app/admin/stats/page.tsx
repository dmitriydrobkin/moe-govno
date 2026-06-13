export const runtime = 'edge';

export default function StatsPage() {
  const stats = [
    { label: 'Общая выручка', value: '0.00 ₴' },
    { label: 'Заказов', value: '0' },
    { label: 'Средний чек', value: '0.00 ₴' },
    { label: 'Брошенных корзин', value: '0' },
  ];

  const recentOrders = [
    { id: '#1003', date: '14.06.2026', amount: '1500.00 ₴', status: 'Ожидает оплаты', statusColor: 'text-chocolate/60' },
    { id: '#1002', date: '13.06.2026', amount: '3200.00 ₴', status: 'Выполнен', statusColor: 'text-gold font-medium' },
    { id: '#1001', date: '12.06.2026', amount: '850.00 ₴', status: 'В доставке', statusColor: 'text-chocolate font-medium' },
  ];

  return (
    <div className="min-h-screen bg-cream-dark py-16 text-chocolate px-4">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Заголовок */}
        <div>
          <h1 className="font-serif text-3xl mb-2">Статистика магазина</h1>
          <p className="font-sans text-sm text-chocolate/50">
            Обзор ключевых показателей эффективности и последних продаж.
          </p>
        </div>

        {/* Сетка карточек статистики */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-cream p-8 shadow-sm border border-chocolate/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <p className="text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-4">{stat.label}</p>
              <p className="text-4xl font-serif text-chocolate">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Таблица последних заказов */}
        <div className="bg-cream p-8 shadow-sm border border-chocolate/5">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-serif text-xl">Последние заказы</h2>
            <button className="text-xs font-sans uppercase tracking-widest text-gold hover:text-chocolate transition-colors border-b border-transparent hover:border-chocolate">
              Смотреть все
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="border-b border-chocolate/20 text-xs uppercase tracking-widest text-chocolate/70">
                  <th className="py-4 px-2 font-normal">ID заказа</th>
                  <th className="py-4 px-2 font-normal">Дата</th>
                  <th className="py-4 px-2 font-normal text-right">Сумма</th>
                  <th className="py-4 px-2 font-normal text-right">Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-chocolate/5 hover:bg-chocolate/5 transition-colors group cursor-pointer">
                    <td className="py-5 px-2 text-chocolate/70 font-medium group-hover:text-gold transition-colors">{order.id}</td>
                    <td className="py-5 px-2 text-chocolate/70">{order.date}</td>
                    <td className="py-5 px-2 text-right font-medium">{order.amount}</td>
                    <td className={`py-5 px-2 text-right ${order.statusColor}`}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
