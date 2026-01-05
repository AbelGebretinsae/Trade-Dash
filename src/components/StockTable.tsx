import { useEffect, useState } from "react";
import { fetchQuote } from "../api/finnhub";

type Stock = {
    symbol: string;
    price: number;
    changePercent: number;
    open: number;
    high: number;
    low: number;
    prevClose: number;
};



export default function StockTable({ symbol, onLoaded, }: { symbol: string; onLoaded: () => void; }) {
    
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStocks() {
            try {
            setLoading(true);
            setError(null);

            const quote = await fetchQuote(symbol);

            setStocks([
                {
                symbol,
                price: quote.price,
                changePercent: quote.changePercent,
                open: quote.open,
                high: quote.high,
                low: quote.low,
                prevClose: quote.prevClose,
                },
            ]);
            } catch (err) {
            setError("Invalid stock symbol. Please try again.");
            } finally {
                setLoading(false);
                onLoaded();           
            }
        }

        loadStocks();
    }, [symbol]);



    if (loading) {
        return <p className="text-gray-600">Loading stock data...</p>
    }

    if (error) {
        return <p className ="text-red-600">{error}</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 bg-white">
            <thead className="bg-gray-100">
                <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">% Change</th>
                </tr>
            </thead>
            <tbody>
                {stocks.map((stock) => (
                <tr key={stock.symbol} className="border-t">
                    <td className="px-4 py-2 font-medium">
                    {stock.symbol}
                    </td>
                    <td className="px-4 py-2">
                    ${stock.price.toFixed(2)}
                    </td>
                    <td
                    className={`px-4 py-2 ${
                        stock.changePercent >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                    >
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            <div className="mt-6 grid grid-cols-4 gap-6 text-sm">
                <div>
                    <p className="text-gray-500 uppercase text-xs">Open</p>
                    <p>${stocks[0].open.toFixed(2)}</p>
                </div>

                <div>
                    <p className="text-gray-500 uppercase text-xs">High</p>
                    <p>${stocks[0].high.toFixed(2)}</p>
                </div>

                <div>
                    <p className="text-gray-500 uppercase text-xs">Low</p>
                    <p>${stocks[0].low.toFixed(2)}</p>
                </div>

                <div>
                    <p className="text-gray-500 uppercase text-xs">Prev Close</p>
                    <p>${stocks[0].prevClose.toFixed(2)}</p>
                </div>
            </div>
        </div>
        );

}
    