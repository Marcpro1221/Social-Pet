import './index.css';
import './austronaut.css';
import { useEffect, useState } from 'react';

const apiKey = "live_0cbBewQyFXHpWa9D5FXXxcXl1eAtLH7Edpvz37x2f3jdOTc3xNWbme16KUlMe5qJ";
const baseUrl = "https://api.thecatapi.com/v1/images/search";
const catFactsUrl = "https://catfact.ninja/fact";
const profilePicsURL = 'https://randomuser.me/api/';

export default function App() {
  const [data, setData] = useState({
    cats: null,
    facts: null,
    profilePic: null
  });

  useEffect(() => {
    async function fetchData() {
      const factsRequestParams = `?max_length=70`;
      const requestParams = `?limit=30&api_key=${apiKey}`;
      const factsUrl = catFactsUrl + factsRequestParams;
      const url = baseUrl + requestParams;

      try {
        // Fetch cat images
        const catImagesResponse = await fetch(url);
        const catData = await catImagesResponse.json();

        const profilePicsResponse = catData.map(()=>
          fetch(profilePicsURL).then(res => res.json()));
        // Fetch a random fact for each cat
        const factsPromises = catData.map(() =>
          fetch(factsUrl).then(res => res.json())
        );
        const factsArray = await Promise.all(factsPromises);
        const profilePicsArray = await Promise.all(profilePicsResponse);

        setData({
          cats: catData,
          facts: factsArray,
          profilePic: profilePicsArray
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (!data.cats || !data.facts) return (
    <div id='loading-container'>
        <div data-js="astro" className="astronaut">
          <div className="head"></div>
          <div className="arm arm-left"></div>
          <div className="arm arm-right"></div>
          <div className="body">
            <div className="panel"></div>
          </div>
          <div className="leg leg-left"></div>
          <div className="leg leg-right"></div>
          <div className="schoolbag"></div>
        </div>
        <p id='loading'>developer contact: marcrolandmarc@gmail.com</p>
    </div>
  );

  return (
    <div className="app">
      <h1 className="title-header">SocialPets</h1>

      <div className="feed">
        {data.cats.map((item, index) => (
          <Post
            key={index}
            avatar={data.profilePic[index].results[0].picture.large}
            username={`${item.id}`}
            img={item.url}
            caption={data.facts[index]?.fact} // ✅ one fact per post
          />
        ))}
      </div>
    </div>
  );
}

function Post({ avatar, username, img, caption }) {
  return (
    <div className="post">
      <div className="post-header">
        <div className="avatar"><img className='avatar' src={avatar} alt="profile" /></div>
        <p className="username">{username}</p>
      </div>

      <img className="post-img" src={img} alt="pet" />

      <div className="post-footer">
        <p className="caption">
          <span className="bold">{username}</span> {caption}
        </p>
      </div>
    </div>
  );
}
