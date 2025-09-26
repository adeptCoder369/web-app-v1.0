export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  console.log('Fetching data from GitHub API...',res);
  
  const repo = await res.json()
  return { props: { repo } }
}
  