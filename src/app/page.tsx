import Link from 'next/link';


export default function Home() {
  return (
    <div>
      <div className = "HomePage">

        <div className = "browseRestaurants">
          <button className = "browseRestaurants-button">Browse Restaurants</button>
        </div>


        <div className = "signIn">
          <button className = "signIn-button">Sign In</button>
        </div>

        <div className = "HomePage-Title">
          <p>Tables4U</p>
        </div>

        <div>
          <p>
            <Link href="/tablespage" className = "link-button">Go to Tables Page</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
