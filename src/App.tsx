import { useState } from "react";
import { useEffect } from "react";
import StockTable from "./components/StockTable";

function App() {

  const [query, setQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl font-semibold">Trade Dash</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Search bar */}
        <form
          className="mb-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query) return;
            
            if (query === selectedSymbol) {
              return; // same symbol, do nothing
            }
            setIsSearching(true);
            setSelectedSymbol(query);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Search symbol (e.g. AAPL)"
            className="w-64 rounded border px-3 py-2"
          />

          <button
            type="submit"
            disabled={isSearching}
            className={`rounded px-4 py-2 text-white ${ 
              isSearching ? "bg-gray-400" : "bg-black" 
            }`}
          >
            {isSearching ? "loading..." : "Search"}
          </button>

          <button
            type ="button"
            className ="rounded bg-gray-200 px-3 py-1 text-sm"
            onClick={() => {
              if(!selectedSymbol) return;
              if(watchlist.includes(selectedSymbol)) return;
              setWatchlist([...watchlist, selectedSymbol]);
              
            }}
          > 
            Add to Watchlist  
          </button>
        </form>

        {watchlist.length > 0 && (
          <div className="mb-b">
            <h2 className="mb-2 text-sm font-semibold text-gray-600">
              Watchlist
            </h2>

            <div className="flex gap-2 flex-wrap">
                {watchlist.map((symbol) => (
                  <div key={symbol} className="flex items-center gap-2">
                    <button
                      key={symbol}
                      onClick={() => setSelectedSymbol(symbol)}
                      className ="rounded bg-blue-200 px-3 py-1 text-sm"
                    >
                      {symbol}
                    </button>

                    <button
                      onClick={() =>
                        setWatchlist(watchlist.filter((s) => s !== symbol))
                      }
                      className="text-xs text-red-600"
                    > 
                      x
                    </button>
                  </div>
                  ))}
            </div>
          </div>
        )}

        {/* Stock data */}
        {selectedSymbol && (
          <StockTable 
            symbol={selectedSymbol} 
            onLoaded={() => setIsSearching(false)}
          /> 
        )}
      </main>
    </div>
  );
}
export default App;
