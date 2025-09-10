import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Categories.css'

const BodyPartsCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

    const fetchData = async (id) => {
        const options = {
            method: 'GET',
            url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${id}`,
            params: { limit: '200' },
            headers: {
               'x-rapidapi-key': '1b945e9274msh59bd56257e8c6b0p19aa2fjsn9fe0c3542fb1',
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const exerciseList = response.data;

            // Fetch images for each exercise in parallel
            const updatedExercises = await Promise.all(
                exerciseList.map(async (exercise) => {
                    const imgUrl = await fetchExerciseImage(exercise.id);
                    return { ...exercise, imgUrl };
                })
            );

            setExercises(updatedExercises);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchExerciseImage = async (exerciseId) => {
        const options = {
            method: 'GET',
            url: `https://exercisedb.p.rapidapi.com/image`,
            params: { exerciseId, resolution: "720" },
            headers: {
                'x-rapidapi-key': '7df6563740mshb65212bf14c2e51p12baecjsnca077856dc10',
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
            },
            responseType: 'blob'
        };

        try {
            const response = await axios.request(options);
            return URL.createObjectURL(response.data); // blob → usable URL
        } catch (error) {
            console.error("Image fetch error:", error);
            return null;
        }
    };

    return (
        <div className='category-exercises-page'>
            <h1>Category: <span>{id}</span></h1>

            {exercises && exercises.length > 0 ? (
                <div className="exercises">
                    {exercises.map((exercise, index) => (
                        <div
                            className="exercise"
                            key={index}
                            onClick={() => navigate(`/exercise/${exercise.id}`)}
                        >
                            {exercise.imgUrl ? (
                                <img src={exercise.imgUrl} alt={exercise.name} />
                            ) : (
                                <p>No image</p>
                            )}
                            <h3>{exercise.name}</h3>
                            <ul>
                                <li>{exercise.target}</li>
                                {exercise.secondaryMuscles.slice(0, 2).map((muscle, idx) => (
                                    <li key={idx}>{muscle}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default BodyPartsCategory;