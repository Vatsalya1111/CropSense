import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Droplets,
  SprayCan,
  Wheat,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  CloudRain,
  Leaf,
} from "lucide-react";

import {
  getFarmData,
  getAdvisories,
} from "../services/api";


function Advisory() {
  const [farm, setFarm] = useState(null);
  const [advisories, setAdvisories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================
     LOAD ADVISORY DATA
  ========================= */

  useEffect(() => {
    async function loadAdvisories() {
      try {
        setLoading(true);
        setError("");

        const [farmData, advisoryData] =
          await Promise.all([
            getFarmData(),
            getAdvisories(),
          ]);

        setFarm(farmData);
        setAdvisories(advisoryData);

      } catch (err) {
        console.error(err);

        setError(
          "Unable to load farm advisories."
        );

      } finally {
        setLoading(false);
      }
    }

    loadAdvisories();
  }, []);


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="advisory-page">

        <div className="page-loading">

          <div className="loading-spinner"></div>

          <p>
            Generating farm advisories...
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error || !farm) {
    return (
      <div className="advisory-page">

        <div className="page-error">

          <h2>
            Advisory unavailable
          </h2>

          <p>
            {error || "Something went wrong."}
          </p>

        </div>

      </div>
    );
  }


  /* =========================
     FIND PRIORITY ADVISORY
  ========================= */

  const priorityAdvisory =
    advisories.find(
      (item) =>
        item.priority === "high"
    ) || advisories[0];


  return (
    <div className="advisory-page">


      {/* =========================
          HEADER
      ========================= */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            FARM DECISION SUPPORT
          </p>

          <h1>
            Advisory
          </h1>

          <p className="page-subtitle">
            Practical recommendations based on
            weather, crop and field conditions.
          </p>

        </div>


        <div className="advisory-farm-badge">

          <Leaf size={17} />

          <div>

            <strong>
              {farm.crop}
            </strong>

            <span>
              {farm.location}
            </span>

          </div>

        </div>

      </header>


      {/* =========================
          PRIORITY ADVISORY
      ========================= */}

      {priorityAdvisory && (

        <section className="priority-advisory">

          <div className="priority-main">

            <div className="priority-icon">

              <AlertTriangle size={25} />

            </div>


            <div>

              <p className="eyebrow">
                ACTION REQUIRED
              </p>

              <h2>
                {priorityAdvisory.title}
              </h2>

              <p className="priority-description">
                {priorityAdvisory.description}
              </p>


              {priorityAdvisory.rainfall && (

                <div className="priority-rain">

                  <CloudRain size={18} />

                  <span>
                    Expected rainfall
                  </span>

                  <strong>
                    {priorityAdvisory.rainfall}
                  </strong>

                </div>

              )}

            </div>

          </div>


          {/* Water saving */}

          <div className="water-saving">

            <Droplets size={22} />

            <span>
              Estimated water saved
            </span>

            <strong>
              ~1,200 L
            </strong>

          </div>

        </section>

      )}


      {/* =========================
          ALL ADVISORIES
      ========================= */}

      <section className="advisory-section">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              FARM ACTIVITIES
            </p>

            <h2>
              Recommendations for your farm
            </h2>

          </div>

        </div>


        <div className="advisory-grid">

          {advisories.map(
            (item, index) => {

              let Icon = Leaf;

              if (
                item.type === "irrigation"
              ) {
                Icon = Droplets;
              }

              if (
                item.type === "spraying"
              ) {
                Icon = SprayCan;
              }

              if (
                item.type === "sowing"
              ) {
                Icon = Wheat;
              }

              if (
                item.type === "harvesting"
              ) {
                Icon = CalendarDays;
              }


              return (

                <article
                  className={`advisory-card ${
                    index === 0
                      ? "advisory-card-highlight"
                      : ""
                  }`}
                  key={
                    item.id ||
                    item.type ||
                    index
                  }
                >

                  <div className="advisory-card-top">

                    <div className="advisory-card-icon">

                      <Icon size={21} />

                    </div>


                    {item.priority ===
                      "high" && (

                      <span className="priority-tag">
                        Priority
                      </span>

                    )}

                  </div>


                  <p className="advisory-type">

                    {item.type
                      ?.charAt(0)
                      .toUpperCase() +
                      item.type?.slice(1)}

                  </p>


                  <h3>
                    {item.title}
                  </h3>


                  <p className="advisory-description">
                    {item.description}
                  </p>


                  <div className="advisory-action">

                    <CheckCircle2 size={16} />

                    <span>
                      Recommended action
                    </span>

                  </div>


                  <button className="advisory-link">

                    View recommendation

                    <ArrowRight size={15} />

                  </button>

                </article>

              );

            }
          )}

        </div>

      </section>


      {/* =========================
          HOW ADVISORY IS GENERATED
      ========================= */}

      <section className="advisory-engine">

        <div className="advisory-engine-icon">

          <Leaf size={21} />

        </div>


        <div>

          <p className="eyebrow">
            AGRISENSE ADVISORY ENGINE
          </p>

          <h3>
            Recommendations are localized
            for your farm.
          </h3>

          <p>
            AgriSense combines Panchayat-level
            weather predictions, farm information,
            crop conditions and sensor observations
            to generate practical recommendations
            for farming activities.
          </p>

        </div>

      </section>

    </div>
  );
}


export default Advisory;