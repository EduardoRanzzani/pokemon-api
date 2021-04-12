import React, { useState, useEffect } from 'react';
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom'

const initialState = {
    count: 0,
    next: '',
    previous: '',
    results: []
}

const POKEMONS_PER_PAGE = 20;

function PokemonList() {
    const [pokemons, setpokemons] = useState(initialState);
    const [page, setPage] = useState(0);
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=${POKEMONS_PER_PAGE}`;


    useEffect(() => {
        axios.get(apiUrl).then(response => {
            setpokemons(response.data);
        });
    });

    function nextPage() {
        if (page === 0) {
            setPage(POKEMONS_PER_PAGE);
        } else if (pokemons.next) {
            setPage(page + POKEMONS_PER_PAGE);
        }
    }

    function previousPage() {
        console.log(pokemons.previous)
        if (pokemons.previous) {
            setPage(page - POKEMONS_PER_PAGE);
        }
    }

    return (
        <div>
            <div className="box" >
                <h1 className="title" >Exibir Pokémon</h1>
            </div>

            <div className="box">
                <table className="table is-striped is-fullwidth is-hoverable is-narrow">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome</th>
                            <th scope="col">URL</th>
                            <th scope="col">Opções</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pokemons && pokemons.results.map((pokemon, index) => {
                            return (
                                <tr key={(index + 1)}>
                                    <th scope="row">{(index + 1) + page}</th>
                                    <td>{pokemon.name}</td>
                                    <td>{pokemon.url}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faSearch} />
                                        <FontAwesomeIcon icon={faEdit} />
                                        <FontAwesomeIcon icon={faTrash} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <nav className="pagination is-rounded is-small" role="navigation" aria-label="pagination">
                    <Link to="/" onClick={e => previousPage()} className="pagination-previous">Página Anterior</Link>
                    <Link to="/" onClick={e => nextPage()} className="pagination-next">Próxima Página</Link>
                </nav>
            </div>
        </div>
    );
}

export default PokemonList;