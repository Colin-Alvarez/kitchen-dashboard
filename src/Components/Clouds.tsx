// src/components/Clouds.tsx
const Clouds = () => {
    const cloudSettings = Array.from({ length: 15 }, (_, i) => ({
      top: `${Math.random() * 90}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${60 + Math.random() * 60}s`,
    }));
  
    return (
      <>
        {cloudSettings.map((c, i) => (
          <div
            key={i}
            className="cloud"
            style={
              {
                '--top': c.top,
                '--delay': c.delay,
                '--duration': c.duration,
              } as React.CSSProperties
            }
          />
        ))}
      </>
    );
  };
  
export default Clouds;
  