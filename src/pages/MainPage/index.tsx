import React from "react";
import Banner from "../../components/Banner";
import Row from "../../components/Row";
import useHomeFeed from "../../hooks/useHomeFeed";

export default function MainPage() {
  const { hero, sections, loading, error } = useHomeFeed();

  if (loading) return <div style={{ color: "#fff", padding: 20 }}>로딩중...</div>;
  if (error) return <div style={{ color: "#fff", padding: 20 }}>{error}</div>;

  return (
    <div>
      <Banner hero={hero}/>
      {sections.map((s) => (
        <Row
          key={s.key}
          title={s.title}
          id={s.key}
          items={s.items}
          variant={s.type}
          isLargeRow={s.type === "top10"}
        />
      ))}
    </div>
  );
}