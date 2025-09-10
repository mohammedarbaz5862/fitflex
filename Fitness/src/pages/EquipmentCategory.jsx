import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Categories.css'

const EquipmentCategory = () => {
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
            url: `https://exercisedb.p.rapidapi.com/exercises/equipment/${id}`,
            params: { limit: '50' },
            headers: {
                'x-rapidapi-key': 'd00afa64e4mshdefea4eae8861a5p11587ajsn9c9328deb19a',
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
                'x-rapidapi-key': 'd00afa64e4mshdefea4eae8861a5p11587ajsn9c9328deb19a',
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

export default EquipmentCategory;
