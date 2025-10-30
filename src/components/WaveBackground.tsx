const WaveBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #1e3a5f 0%, #2d5a7b 50%, #87CEEB 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.45))'
        }}
      />
    </div>
  );
};

export default WaveBackground;
