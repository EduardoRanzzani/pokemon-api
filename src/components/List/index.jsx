import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, makeStyles, Typography } from '@material-ui/core';

import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import Modal from '../Modal';

import "./index.css";

const pokemonState = {
    count: 0,
    next: '',
    previous: '',
    results: [],
};

const initialState = {
    showModal: false,
    selectedPokemon: {}
};

const useStyles = makeStyles({
    root: {
        minWidth: 300,
    },
    media: {
        height: 250,
    },
});

const modalData = {
    pokemonData: {}
};

const POKEMONS_PER_PAGE = 10;

const PokemonList = () => {
    const [modalPokemon, setModalPokemon] = useState(modalData);
    const [pokemons, setPokemons] = useState(pokemonState);
    const [state, setState] = useState(initialState);
    const [page, setPage] = useState(0);
    const classes = useStyles();

    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=${POKEMONS_PER_PAGE}`;

    useEffect(() => {
        axios.get(apiUrl).then(response => {
            setPokemons(response.data);
        }, console.error);
    }, [apiUrl]);

    function nextPage() {
        if (page === 0) {
            setPage(POKEMONS_PER_PAGE);
        } else if (pokemons.next) {
            setPage(page + POKEMONS_PER_PAGE);
        }
    }

    function previousPage() {
        if (pokemons.previous) {
            setPage(page - POKEMONS_PER_PAGE);
        }
    }

    return (
        <div>
            <div className="box" >
                <h1 className="title" >Exibir Pokémon</h1>

                <hr />

                <table className="table is-striped is-fullwidth is-hoverable is-narrow">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome</th>
                            <th scope="col">URL</th>
                            <th scope="col" style={{ width: '110px' }}>Opções</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pokemons && pokemons.results.map((pokemon, index) => {
                            return (
                                <tr key={(index + 1)}>
                                    <th scope="row">{(index + 1) + page}</th>
                                    <td className="capitalize" >{pokemon.name}</td>
                                    <td>{pokemon.url}</td>
                                    <td>
                                        <IconButton color="primary" size="small" onClick={e => {
                                            setState({ showModal: !state.showModal, selectedPokemon: pokemon });
                                            axios.get(pokemon.url).then(response => setModalPokemon(response.data));
                                        }} >
                                            <SearchTwoToneIcon />
                                        </IconButton>
                                        <IconButton color="primary" disabled size="small">
                                            <EditTwoToneIcon />
                                        </IconButton>
                                        <IconButton color="secondary" disabled size="small">
                                            <DeleteTwoToneIcon />
                                        </IconButton>
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
            {
                state.showModal ? (
                    < Modal >
                        <Card className={classes.root}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.media}
                                    image={
                                        modalPokemon.sprites
                                            ? modalPokemon.sprites.other.dream_world.front_default
                                            : "/teste"
                                    }
                                    title={modalPokemon.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2" className="capitalize" >
                                        {`#${modalPokemon.id} - ${modalPokemon.name}`}
                                    </Typography>
                                    <ul>
                                        <li>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                Peso: {(modalPokemon.weight * 0.453592).toFixed(1)} kg
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                Altura: {(modalPokemon.height * 0.3048).toFixed(2)} metros
                                            </Typography>
                                        </li>
                                    </ul>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button onClick={e => setState({ showModal: !state.showModal, selectedPokemon: {} })} size="small" color="primary">
                                    Fechar
                                </Button>
                            </CardActions>
                        </Card>
                    </Modal>
                ) : null
            }
        </div >
    );
};

export default PokemonList;