import React, { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [period, setPeriod] = useState("day");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch pages for dropdown
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/facebook/pages", {
          withCredentials: true,
        });
        setPages(res.data.pages || []);
        if (res.data.pages?.length > 0) {
          setSelectedPage(res.data.pages[0].id || res.data.pages[0].pageId);
        }
      } catch (err) {
        console.error("Failed to fetch pages:", err);
        setPages([]);
      }
    };
    fetchPages();
  }, []);

  // Fetch analytics data
  useEffect(() => {
    if (!selectedPage) return;
    setLoading(true);
    axios
      .get("http://localhost:5000/insights/page", {
        params: {
          pageId: selectedPage,
          metrics: "page_impressions_unique,page_post_engagements,page_follows",
          period,
        },
        withCredentials: true,
      })
      .then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching insights:", err);
        setAnalytics(null);
        setLoading(false);
      });
  }, [selectedPage, period]);

  // Prepare chart data
  let growth = [];
  let maxValue = 1;
  if (analytics?.data) {
    growth = analytics.data.map((metric) => {
      const val = metric?.values?.[0]?.value;
      return {
        label: metric.title || metric.name,
        value: typeof val === "object" ? Object.values(val)[0] : val || 0,
      };
    });
    maxValue = Math.max(...growth.map((item) => item.value), 1);
  }

  const purple = "#a78bfa";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center pt-16"
      style={{ background: "#23272f" }}
    >
      <style>{`
        .analytics-container {
          background: #23283a;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
          margin-top: 32px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 900px;
        }
        .analytics-label {
          color: ${purple};
          font-weight: 600;
        }
        .analytics-select {
          background: #181c24;
          color: #fff;
          border: 1px solid ${purple};
          border-radius: 8px;
          padding: 0.5rem 1rem;
          margin-right: 0.5rem;
        }
        .analytics-overview-card {
          background: #181c24;
          border-radius: 12px;
          padding: 1.2rem 1rem;
          color: #fff;
          min-width: 150px;
          flex: 1;
          box-shadow: 0 2px 8px #0002;
          border-left: 4px solid ${purple};
        }
        .analytics-bar {
          background: linear-gradient(180deg, ${purple} 60%, #1e293b 100%);
        }
        .analytics-bar-label {
          color: ${purple};
          font-size: 1.1rem;
          font-weight: 700;
        }
        .analytics-bar-value {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 6px;
        }
      `}</style>

      <div className="analytics-container">
        <div className="flex flex-wrap gap-6 mb-8 justify-between items-center">
          <div>
            <label className="analytics-label mr-2">Select Page:</label>
            <select
              className="analytics-select"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
            >
              {pages.map((page) => (
                <option key={page.id || page.pageId} value={page.id || page.pageId}>
                  {page.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="analytics-label mr-2">Period:</label>
            <select
              className="analytics-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="days_28">Monthly</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10" style={{ color: purple }}>
            Loading analytics...
          </div>
        ) : analytics && growth.length > 0 ? (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: purple }}>
                Overview
              </h3>
              <div className="flex flex-wrap gap-8">
                {growth.map((item, idx) => (
                  <div key={idx} className="analytics-overview-card">
                    <div className="text-sm" style={{ color: "#c4b5fd" }}>
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Bar Graph */}
            <div className="bg-[#181c24] rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: purple }}>
                Growth Chart
              </h4>
              <div className="flex items-end h-40 w-full gap-4">
                {growth.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div className="analytics-bar-value">{item.value}</div>
                    <div
                      className="analytics-bar rounded-t w-8"
                      style={{
                        height: `${(item.value / maxValue) * 120 + 10}px`,
                        minHeight: "10px",
                        transition: "height 0.3s",
                      }}
                      title={item.value}
                    ></div>
                    <span className="analytics-bar-label mt-2">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10" style={{ color: purple }}>
            No analytics data found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
