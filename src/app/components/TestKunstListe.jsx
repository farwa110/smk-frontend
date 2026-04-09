const TestKunstListe = async () => {
  const data = await fetch("https://api.smk.dk/api/v1/art/search/?keys=*&offset=0&rows=100");
  const kunst = await data.json();

  return (
    <div>
      {kunst.items.map((item) => {
        return <li key={item.id}>{item.id}</li>;
      })}
    </div>
  );
};

export default TestKunstListe;
