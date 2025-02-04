import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import api from '../../api/growers';
import theme from '../common/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProvider } from '../../context/AppContext';
import { GrowerProvider } from '../../context/GrowerContext';
import FilterGrower from '../../models/FilterGrower';
import FilterTopGrower from '../FilterTopGrower';
import Growers from '../Growers';

import * as loglevel from 'loglevel';
const log = loglevel.getLogger('../tests/grower.test');

jest.mock('../../api/growers');

const GROWER = {
  id: 1,
  firstName: 'testFirstName',
  lastName: 'testLastName',
  email: 'test@gmail.com',
  organization: null,
  phone: '123-456-7890',
  imageUrl:
    'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.11.17.12.45.48_8.42419553_-13.16719857_11d157fb-1bb0-4497-a7d7-7c16ce658158_IMG_20201117_104118_1916638584657622896.jpg',
  personId: null,
  organizationId: 11,
};

const GROWERS = [
  {
    id: 1,
    firstName: 'testFirstName',
    lastName: 'testLastName',
    email: 'test@gmail.com',
    organization: null,
    phone: '123-456-7890',
    imageUrl:
      'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.11.17.12.45.48_8.42419553_-13.16719857_11d157fb-1bb0-4497-a7d7-7c16ce658158_IMG_20201117_104118_1916638584657622896.jpg',
    personId: null,
    organizationId: 1,
  },
  {
    id: 2,
    firstName: 'testFirstName2',
    lastName: 'testLastName2',
    email: 'test2@gmail.com',
    organization: null,
    phone: '123-456-7890',
    imageUrl: '',
    personId: null,
    organizationId: 11,
  },
  {
    id: 3,
    firstName: 'testFirstName3',
    lastName: 'testLastName3',
    email: 'test3@gmail.com',
    organization: null,
    phone: '123-456-7890',
    imageUrl: '',
    personId: null,
    organizationId: 1,
  },
];

const ORGS = [
  {
    id: 0,
    name: 'Dummy Org',
  },
  {
    id: 1,
    name: 'Another Org',
  },
];

describe('growers', () => {
  let api;
  let growerValues;

  beforeEach(() => {
    //mock the api
    api = require('../../api/growers').default;

    api.getCount = () => {
      log.debug('mock getCount');
      return Promise.resolve({ count: 2 });
    };
    api.getGrower = () => {
      log.debug('mock getGrower');
      return Promise.resolve(GROWER);
    };
    api.getGrowers = () => {
      log.debug('mock load');
      return Promise.resolve(GROWERS);
    };
  });

  describe('with a default context', () => {
    //{{{
    beforeEach(async () => {
      growerValues = {
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
      };

      render(
        <BrowserRouter>
          <AppProvider value={{ orgList: ORGS }}>
            <GrowerProvider value={growerValues}>
              <Growers />
            </GrowerProvider>
          </AppProvider>
        </BrowserRouter>,
      );

      await act(() => api.getGrowers());
      await act(() => api.getCount());
    });

    afterEach(cleanup);

    it('renders subcomponents of filter top grower', () => {
      const filter = screen.getByRole('button', { name: /filter/i });
      userEvent.click(filter);
      // screen.logTestingPlaygroundURL();

      expect(screen.getByLabelText('Grower ID')).toBeInTheDocument();

      expect(screen.getByLabelText('Person ID')).toBeInTheDocument();

      expect(screen.getByLabelText('Organization')).toBeInTheDocument();

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    });

    it('renders grower page', () => {
      expect(
        screen.getByText(/testFirstName testLastName/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/testFirstName2 testLastName2/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/testFirstName3 testLastName3/i),
      ).toBeInTheDocument();

      const ids = screen.getAllByText(/ID:/i);
      expect(ids).toHaveLength(3);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      const pageSize = screen.getAllByText(/growers per page:/i);
      expect(pageSize).toHaveLength(2);
    });
  });
});

// describe.skip('planter', () => {
//   //{{{
//   let store;
//   let planter = {
//     name: 'OK',
//   };
//   let filter;

//   beforeEach(() => {});

//   describe('with a default store', () => {
//     //{{{
//     beforeEach(async () => {
//       store = init({
//         models: {
//           planters,
//         },
//       });
//       //set page size
//       expect(store.getState().planters.pageSize).toBe(24);
//       await store.dispatch.planters.changePageSize({ pageSize: 1 });
//       expect(store.getState().planters.pageSize).toBe(1);
//     });

//     it('check initial state', () => {
//       expect(store.getState().planters.planters).toBeInstanceOf(Array);
//       expect(store.getState().planters.planters).toHaveLength(0);
//       expect(store.getState().planters.filter).toBeInstanceOf(FilterPlanter);
//     });

//     describe('load(0) ', () => {
//       beforeEach(async () => {
//         api.getPlanters.mockReturnValue([planter]);
//         filter = new FilterPlanter({
//           personId: 1,
//         });
//         const result = await store.dispatch.planters.load({
//           pageNumber: 0,
//           filter,
//         });
//         expect(result).toBe(true);
//       });

//       it('should get some planters', () => {
//         expect(store.getState().planters.planters).toHaveLength(1);
//       });

//       it('should call api with param: skip = 0', () => {
//         expect(api.getPlanters).toHaveBeenCalledWith({
//           skip: 0,
//           rowsPerPage: 1,
//           filter: filter,
//         });
//       });

//       it('currentPage should be 0', () => {
//         expect(store.getState().planters.currentPage).toBe(0);
//       });

//       it('Sould have filter be set to store', () => {
//         expect(store.getState().planters.filter).toBe(filter);
//       });

//       describe('load(1)', () => {
//         beforeEach(async () => {
//           api.getPlanters.mockReturnValue([planter]);
//           const result = await store.dispatch.planters.load({
//             pageNumber: 1,
//             filter,
//           });
//           expect(result).toBe(true);
//         });

//         it('should get some planters', () => {
//           expect(store.getState().planters.planters).toHaveLength(1);
//         });

//         it('should call api with param: skip = 1', () => {
//           expect(api.getPlanters).toHaveBeenCalledWith({
//             skip: 1,
//             rowsPerPage: 1,
//             filter,
//           });
//         });
//       });

//       describe('count()', () => {
//         beforeEach(async () => {
//           api.getCount.mockReturnValue({ count: 2 });
//           expect(await store.dispatch.planters.count()).toBe(true);
//         });

//         it('should call getCount api with param: filter', () => {
//           expect(api.getCount).toHaveBeenCalledWith({
//             filter,
//           });
//         });

//         it('Should get count = 2', async () => {
//           expect(store.getState().planters.count).toBe(2);
//         });
//       });
//     });
//   });
// });
