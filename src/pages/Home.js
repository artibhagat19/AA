import { useEffect, useState } from "react";
import Summarizer from "../components/Summarizer";
import SummaryList from "../components/SummaryList";

const Home = () => {
    const [summaries, setSummaries] = useState([]);

    useEffect(() => {
        setSummaries(JSON.parse(localStorage.getItem("summaries")) || []);
    }, []);

    const handleSaveSummary = (inputText, summaryText) => {
        const newSummary = { id: Date.now(), text: `<strong>Input:</strong> ${inputText} <br> <strong>Summary:</strong> ${summaryText}` };
        const updatedSummaries = [...summaries, newSummary];

        localStorage.setItem("summaries", JSON.stringify(updatedSummaries));
        setSummaries(updatedSummaries);
    };

    return (
        <div className="home">
            <Summarizer onSave={handleSaveSummary} />
            <SummaryList />
        </div>
    );
};

export default Home;
