import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import '../styles/Exercise.css'

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState();
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    const options = {
      method: 'GET',
      url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
      headers: {
        'x-rapidapi-key': '7df6563740mshb65212bf14c2e51p12baecjsnca077856dc10',
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const exerciseData = response.data;

      // fetch image separately
      const imgUrl = await fetchExerciseImage(id);

      setExercise({ ...exerciseData, imgUrl });

      fetchRelatedVideos(exerciseData.name);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExerciseImage = async (id) => {
    const options = {
      method: 'GET',
      url: `https://exercisedb.p.rapidapi.com/image`,
      params: { exerciseId: id, resolution: "1080" }, // large is valid
      headers: {
        'x-rapidapi-key': '1b945e9274msh59bd56257e8c6b0p19aa2fjsn9fe0c3542fb1',
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      },
      responseType: 'blob' // because this endpoint returns image binary
    };

    try {
      const response = await axios.request(options);
      return URL.createObjectURL(response.data); // convert blob → usable img URL
    } catch (error) {
      console.error("Image fetch error:", error);
      return null;
    }
  };

  const fetchRelatedVideos = async (name) => {
    const options = {
      method: 'GET',
      url: 'https://youtube-search-and-download.p.rapidapi.com/search',
      params: {
        query: `${name}`,
        hl: 'en',
        upload_date: 't',
        duration: 'l',
        type: 'v',
        sort: 'r'
      },
      headers: {
   'x-rapidapi-key': '1b945e9274msh59bd56257e8c6b0p19aa2fjsn9fe0c3542fb1',
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setRelatedVideos(response.data.contents);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='exercise-page'>
      {exercise && (
        <div className="exercise-container">
          <div className="exercise-image">
            {exercise.imgUrl ? (
              <img src={exercise.imgUrl} alt="exercise img" />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div className="exercise-data">
            <h3>{exercise.name}</h3>
            <span>
              <b>Target:</b>
              <p>{exercise.target}</p>
            </span>
            <span>
              <b>Equipment:</b>
              <p>{exercise.equipment}</p>
            </span>
            <span>
              <b>Secondary Muscles:</b>
              <ul>
                {exercise.secondaryMuscles.map((muscle, index) => (
                  <li key={index}>{muscle}</li>
                ))}
              </ul>
            </span>
            <div className="exercise-instructions">
              <h3>Instructions</h3>
              {exercise.instructions.map((instruction, index) => (
                <ul key={index}>
                  <li>{instruction}</li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="related-videos-container">
        <h3>Related Videos on Youtube</h3>
        {relatedVideos && relatedVideos.length > 0 && (
          <div className="related-videos">
            {relatedVideos.map((video, index) => {
              return index < 15 && (
                <div
                  className="related-video"
                  key={index}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.video.videoId}`, "_blank")}
                >
                  <img src={video.video.thumbnails[0].url} alt="" />
                  <h4>{video.video.title.slice(0, 40)}...</h4>
                  <span>
                    <p>{video.video.channelName}</p>
                    <p>{video.video.viewCountText}</p>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;