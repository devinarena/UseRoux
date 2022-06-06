module.exports = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: "/simulator",
        destination: "/simulator/index.html"
      }
    ]
  }
}
