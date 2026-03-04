import React from "react";

export default function HomeLoading() {
  return (
    <div className="container-main">
      {/* HomeBanner Skeleton */}
      <div
        className="skeleton"
        style={{ width: "100%", height: "220px", borderRadius: "16px", marginBottom: "2.5rem" }}
      />

      {/* Section title */}
      <div
        className="skeleton"
        style={{ width: "200px", height: "28px", borderRadius: "8px", marginBottom: "1.5rem" }}
      />

      {/* Categories Grid */}
      <div className="categories-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width: "100%", height: "180px", borderRadius: "12px" }}
          />
        ))}
      </div>
    </div>
  );
}
