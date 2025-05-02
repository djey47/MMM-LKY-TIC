const HistorySection = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Historique</h2>
      <p className="text-gray-500">
        L'historique des données de consommation et de production d'énergie.
      </p>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Graphiques</h3>
        <p className="text-gray-500">
          Graphiques des données de consommation et de production d'énergie.
        </p>
      </div>
    </div>
  );
};

export default HistorySection;
