import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@reach/router';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';

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

const POKEMON_PER_PAGE = 10;

const PokemonList = () => {
    const [modalPokemon, setModalPokemon] = useState(modalData);
    const [pokemons, setPokemons] = useState(pokemonState);
    const [state, setState] = useState(initialState);
    const [page, setPage] = useState(0);
    const classes = useStyles();

    const apiUrl = `https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=${POKEMON_PER_PAGE}`;

    useEffect(() => {
        axios.get(apiUrl).then(response => {
            setPokemons(response.data);
        }, console.error);
    }, [apiUrl]);

    const nextPage = () => {
        if (page === 0) {
            setPage(POKEMON_PER_PAGE);
        } else if (pokemons.next) {
            setPage(page + POKEMON_PER_PAGE);
        }
    };

    const previousPage = () => {
        if (pokemons.previous) {
            setPage(page - POKEMON_PER_PAGE);
        }
    };

    return (
        <div>
            <div className="box" >
                <Link to="/">
                    <h1 className="title" >Exibir Pokémon</h1>
                </Link>

                <hr />

                <TableContainer>
                    <Table aria-label="enhanced table" >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">#</TableCell >
                                <TableCell align="right">Nome</TableCell >
                                <TableCell align="right">Url</TableCell >
                                <TableCell align="right" style={{ width: '120px' }}>Opções</TableCell >
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pokemons.results
                                .map((pokemon, index) => {
                                    const id = index + 1;

                                    return (
                                        <TableRow key={id} hover tabIndex={-1}>
                                            <TableCell component="th" scope="row">{id + page}</TableCell>
                                            <TableCell className="capitalize" >{pokemon.name}</TableCell >
                                            <TableCell >{pokemon.url}</TableCell >
                                            <TableCell >
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
                                            </TableCell >
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <nav className="pagination is-rounded is-small" role="navigation" aria-label="pagination">
                    <Link to="/" onClick={() => previousPage()} className="pagination-previous">Página Anterior</Link>
                    <Link to="/" onClick={() => nextPage()} className="pagination-next">Próxima Página</Link>
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
                                            ? modalPokemon.sprites.front_default
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
                                <Button onClick={() => setState({ showModal: !state.showModal, selectedPokemon: {} })} size="small" color="primary">
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