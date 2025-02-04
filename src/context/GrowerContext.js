import React, { useState, createContext } from 'react';
import FilterGrower from '../models/FilterGrower';
import api from '../api/growers';
import * as loglevel from 'loglevel';

const log = loglevel.getLogger('../context/GrowerContext');

export const GrowerContext = createContext({
  growers: [],
  pageSize: 24,
  count: null,
  currentPage: 0,
  filter: new FilterGrower(),
  isLoading: false,
  totalGrowerCount: null,
  load: () => {},
  getCount: () => {},
  changePageSize: () => {},
  changeCurrentPage: () => {},
  getGrower: () => {},
  updateGrower: () => {},
  updateGrowers: () => {},
  updateFilter: () => {},
  getTotalGrowerCount: () => {},
});

export function GrowerProvider(props) {
  const [growers, setGrowers] = useState([]);
  const [pageSize, setPageSize] = useState(24);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState(new FilterGrower());
  const [isLoading, setIsLoading] = useState(false);
  const [totalGrowerCount, setTotalGrowerCount] = useState(null);

  // EVENT HANDLERS

  const changePageSize = async (pageSize) => {
    setPageSize(pageSize);
  };

  const changeCurrentPage = async (currentPage) => {
    setCurrentPage(currentPage);
  };

  const updateGrowers = (growers) => {
    setGrowers(growers);
  };

  const load = async () => {
    log.debug('load growers');
    setIsLoading(true);
    const pageNumber = currentPage;
    const growers = await api.getGrowers({
      skip: pageNumber * pageSize,
      rowsPerPage: pageSize,
      filter,
    });
    setGrowers(growers);
    setIsLoading(false);
  };

  const getCount = async () => {
    const { count } = await api.getCount({ filter });
    setCount(count);
  };

  const getGrower = async (payload) => {
    const { id } = payload;
    // Look for a match in the local state first
    let grower = growers.find((p) => p.id === id);
    if (!grower) {
      // Otherwise query the API
      grower = await api.getGrower(id);
    }
    return grower;
  };

  const updateGrower = async (payload) => {
    await api.updateGrower(payload);
    const updatedGrower = await api.getGrower(payload.id);
    const index = growers.findIndex((p) => p.id === updatedGrower.id);
    if (index >= 0) {
      const growers = Object.assign([], growers, {
        [index]: updatedGrower,
      });
      setGrowers(growers);
    }
  };

  const updateFilter = async (filter) => {
    setCurrentPage(0);
    setFilter(filter);
  };

  const getTotalGrowerCount = async () => {
    const { count } = await api.getCount({});
    setTotalGrowerCount(count);
  };

  const value = {
    growers,
    pageSize,
    count,
    currentPage,
    filter,
    isLoading,
    totalGrowerCount,
    load,
    getCount,
    changePageSize,
    changeCurrentPage,
    getGrower,
    updateGrower,
    updateGrowers,
    updateFilter,
    getTotalGrowerCount,
  };

  return (
    <GrowerContext.Provider value={value}>
      {props.children}
    </GrowerContext.Provider>
  );
}
