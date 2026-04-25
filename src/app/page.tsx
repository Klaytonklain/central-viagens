import Link from "next/link";

export default function HomePage() {
  const destinations = [
    { name: "Tokyo", country: "Japão", desc: "Tradição e modernidade em harmonia" },
    { name: "Paris", country: "França", desc: "A cidade do amor e da cultura" },
    { name: "Cancún", country: "México", desc: "Praias paradisíacas no Caribe" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Central Viagens</h1>
        <div className="flex gap-4">
          <Link href="/login" className="text-blue-100 hover:text-white text-sm transition">Entrar</Link>
          <Link href="/register" className="bg-white text-blue-700 px-4 py-1 rounded font-semibold text-sm hover:bg-blue-50 transition">Cadastrar</Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Sua próxima aventura começa aqui</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          Descubra destinos incríveis, pacotes exclusivos e faça sua reserva com toda comodidade.
        </p>
        <Link href="/register" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition inline-block">
          Comece agora
        </Link>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">Destinos populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <div key={d.name} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <h4 className="text-lg font-bold text-gray-800">{d.name}</h4>
                <p className="text-blue-600 text-sm font-medium mb-2">{d.country}</p>
                <p className="text-gray-500 text-sm">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Por que escolher a Central Viagens?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Melhores preços", desc: "Pacotes com os melhores valores do mercado" },
              { title: "Suporte 24h", desc: "Equipe disponível para te ajudar a qualquer hora" },
              { title: "Segurança", desc: "Reservas garantidas e pagamento seguro" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-5 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-400 py-8 px-6 text-center text-sm mt-auto">
        <p>© 2024 Central Viagens. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
