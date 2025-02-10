import { useEffect, useState } from "react";

const SummaryList = () => {
    const [summaries, setSummaries] = useState([]);

    useEffect(() => {
        setSummaries(JSON.parse(localStorage.getItem("summaries")) || []);
    }, []);

    const deleteSummary = (id) => {
        const updatedSummaries = summaries.filter((summary) => summary.id !== id);
        localStorage.setItem("summaries", JSON.stringify(updatedSummaries));
        setSummaries(updatedSummaries);
    };

    return (
        <div>
            <h2>Saved Summaries:</h2>
            <ul>
                {summaries.map((summary) => (
                    <li key={summary.id}>
                        <p dangerouslySetInnerHTML={{ __html: summary.text }}></p>
                        <button onClick={() => deleteSummary(summary.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SummaryList;
