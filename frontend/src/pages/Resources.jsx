import { useEffect, useState } from "react";

import API from "../services/api";
import SearchBar from "../components/SearchBar";

function Resources() {
  const [resources, setResources] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await API.get(
          "/resources"
        );

        setResources(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources =
    resources.filter((resource) =>
      resource.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      resource.category
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div>
      <h1>Placement Resources</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <h2>Loading resources...</h2>
      ) : filteredResources.length === 0 ? (
        <p>No resources found.</p>
      ) : (
        <div className="resource-grid">
          {filteredResources.map((resource) => (
            <div
              className="card"
              key={resource._id}
            >
              <h2>{resource.title}</h2>

              <p>
                {resource.description}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {resource.category}
              </p>

              <a
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                className="explore-btn"
              >
                Open Resource
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resources;