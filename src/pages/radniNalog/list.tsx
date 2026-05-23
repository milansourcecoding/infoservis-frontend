/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-fragments */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable prefer-template */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
/* eslint-disable import/extensions */
import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import isEqual from 'lodash/isEqual';
import { Icon } from '@iconify/react';

import { useLocales } from 'src/locales';

// @mui
import { alpha } from '@mui/material/styles';

import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  Grid,
} from '@mui/material';

import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import ListRow from './listRow.tsx';
import BasicSearchToolbar from '../sifarnici/_components/basicSearchToolbar.tsx';
import BasicTabsToolbar from '../sifarnici/_components/basicTabsToolbar.tsx';

import RangePicker from '../../components/dateRangePicker/DateRangePicker.tsx';

import { removeRow, updateRow, downloadPDF, viewPDF, downloadCSV, getTabColorStatusDokumenta, prepareDate, saveDate, getDateRanges, getSelectedRangeDate } from '../../utils/utils.tsx';
import { UserType, RemoveAction, StatusDokumenta } from '../../utils/enums.tsx';

// components
import MainContainer from 'src/components/container/MainContainer.tsx';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import Label from 'src/components/label/index.js';
import Scrollbar from 'src/components/scrollbar/index.js';

import Form from './form.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice, { API, LANGUAGE, getFields } from './reduxSlice.tsx';
import listSlice from '../../utils/slice/form/listSlice.tsx';
import RemovePopup from '../../utils/slice/remove/removePopup.tsx';

// ----------------------------------------------------------------------

const List = () => {
  const { t } = useLocales();

  const DEFAULT_FILTER = StatusDokumenta.Processing;
  const MAIN_STATUS = 'processing';

  const TABLE_HEAD = [
    { id: 'brojDokumenta', label: getFields(t, 'brojDokumenta')?.label },
    { id: 'napomena', label: getFields(t, 'napomena')?.label },
    { id: 'radnici_ids', label: getFields(t, 'radnici_ids')?.label, disableSort: true },
    { id: 'brojRadnihSatiPoRadniku', label: getFields(t, 'brojRadnihSatiPoRadniku')?.label },
    { id: 'cenaRadnogSataIzUgovora', label: getFields(t, 'cenaRadnogSataIzUgovora')?.label },
    { id: 'lift_id', label: getFields(t, 'lift_id')?.label },
    { id: 'kategorija_id', label: getFields(t, 'kategorija_id')?.label },
    { id: 'status', label: getFields(t, 'status')?.label },
    { id: 'updated_at', label: t('table.updated_at'), width: 180 },
    { id: '', width: 50 },
  ];

  const defaultFilters = {
    name: '',
    role: [],
    status: MAIN_STATUS,
  };

  const { isLoading, rows, total, currentPage, pageSize, sortColumn, sortDir, searchQuery, stats, fromDate, toDate } = useTypedSelector((state: RootState) => state.listSlice);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(listSlice.changeFromDate(saveDate(moment().startOf('isoWeek'))));
    dispatch(listSlice.changeToDate(saveDate(moment().endOf('isoWeek'))));
    dispatch(listSlice.changeStatus(DEFAULT_FILTER));
    dispatch(listSlice.calStatsApi(API, searchQuery));

    return () => {
      dispatch(listSlice.resetForm());
    }
  }, []);


  const table = useTable();
  const [filters, setFilters] = useState(defaultFilters);
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!(rows && rows.length > 0) && canReset) || !(rows && rows.length > 0);
    
    
  useEffect(() => {
    if(fromDate !== '' && toDate !== ''){
      dispatch(listSlice.calReadApi(API));
      dispatch(listSlice.calStatsApi(API, searchQuery));
    }
  }, [fromDate, toDate]);


  const handleFilters = useCallback(
    (name: any, value: any) => {
      table.onResetPage();
      setFilters((prevState) => {
        const lbl = stats.find((x: any) => x.value === value);
        return {
          ...prevState,
          [name]: value,
          label: lbl ? lbl.label : value
        }
      });

      let status: any = DEFAULT_FILTER;
      if(value === 'all'){
        status = null;
      } else if(value === 'processing'){
        status = StatusDokumenta.Processing;
      } else if(value === 'finished'){
        status = StatusDokumenta.Zavrsen;
      } else if(value === 'cancelled'){
        status = StatusDokumenta.Storniran;
      }
      dispatch(listSlice.changeStatus(status));

      dispatch(listSlice.calReadApi(API));
    },
    [table]
  );


  const preFilterComponent = () => {
    return <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12}>
        <RangePicker
          fromDate={fromDate}
          toDate={toDate}
          onApply={(item: any) => {
            let selectedDate: any = getSelectedRangeDate(item);
            dispatch(listSlice.changeFromToDate(selectedDate));
          }}
        />
      </Grid>
    </Grid>
  }


  return <MainContainer title={t(LANGUAGE + '.title')} roles={[ UserType.Admin, UserType.Radnik ]}>
    <CustomBreadcrumbs
      heading={t('menu.sifarnici_item.' + LANGUAGE)}
      links={[

        { name: t('menu.dashboard'), href: '/dashboard' },
        { name: t('form.listTitle') }
      ]}
      action={
        <Button
          variant="contained"
          startIcon={<Icon icon={'mingcute:add-line'} />}
          onClick={() => {
            dispatch(slice.setShow({ show: true, id: null, payload: null }))
          }}
        >
          {t('buttons.add')}
        </Button>
      }
      sx={{
        mb: { xs: 3, md: 5 },
      }}
      moreLink={null}
      activeLast={null}
    />

    <Card>
      <Tabs
        value={filters.status}
        onChange={(e: any, newValue: any) => {
          handleFilters('status', newValue);

          if(newValue === 'all'){
            dispatch(listSlice.changeStatus(null));
            dispatch(listSlice.calReadApi(API));
          } else {
            dispatch(listSlice.calReadApi(API));
          }
        }}
        sx={{
          px: 2.5,
          boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        {stats.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                }
                color={getTabColorStatusDokumenta(tab.value)}
              >
                {tab.value === 'all' && tab.count}
                {tab.value === 'processing' && tab.count}
                {tab.value === 'finished' && tab.count}
                {tab.value === 'cancelled' && tab.count}
              </Label>
            }
          />
        ))}
      </Tabs>

      <BasicSearchToolbar
        path={API}
        title={t(LANGUAGE + '.title')}
        onSearch={(searchValue: any) => {
          if(searchValue){
            dispatch(listSlice.changeCurrentPage(1));
            dispatch(listSlice.changeSearchQuery(searchValue));
            dispatch(listSlice.calReadApi(API));
            dispatch(listSlice.calStatsApi(API, searchValue));
          }
        }}
        preFilterComponent={preFilterComponent()}
      />

      {canReset && (
        <BasicTabsToolbar
          mainStatus={MAIN_STATUS}
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={() => {
            setFilters(defaultFilters);

            dispatch(listSlice.changeStatus(DEFAULT_FILTER));
            dispatch(listSlice.changeSearchQuery(null));
            dispatch(listSlice.calReadApi(API));
          }}
          results={rows.length}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          sx={null}
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={(rows && rows.length > 0) ? rows.length : 0}
          onSelectAllRows={(checked: boolean) => {
            table.onSelectAllRows(
              checked,
              rows.map((row: any) => row.id)
            )
          }}
          action={
            <>
              <Tooltip title={t('buttons.exportCSV')}>
                <IconButton color="primary" onClick={() => {
                  const title = t(LANGUAGE + '.title');
                  const params: any = { title, orientation: 'portrait', ids: table.selected.join(',') };
                  dispatch(listSlice.calGenerateCSVApi(params, API, (_data: any|null, _state: boolean|null) => {
                    if(_state){
                      downloadCSV(title, _data);
                    }
                  }))
                }}>
                  <Icon icon={'ph:file-csv-bold'} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('buttons.exportPdf')}>
                <IconButton color="primary" onClick={() => {
                  const title = t(LANGUAGE + '.title');
                  const params: any = { title, orientation: 'portrait', ids: table.selected.join(',') };
                  dispatch(listSlice.calGeneratePDFApi(params, API, (_data: any|null, _state: boolean|null) => {
                    if(_state){
                      downloadPDF(title, _data);
                    }
                  }))
                }}>
                  <Icon icon={'ph:file-pdf-bold'} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('buttons.print')}>
                <IconButton color="primary" onClick={() => {
                  const title = t(LANGUAGE + '.title');
                  const params: any = { title, orientation: 'portrait', ids: table.selected.join(',') };
                  dispatch(listSlice.calGeneratePDFApi(params, API, (_data: any|null, _state: boolean|null) => {
                    if(_state){
                      viewPDF(_data);
                    }
                  }))
                }}>
                  <Icon icon={'solar:printer-minimalistic-bold'} />
                </IconButton>
              </Tooltip>
            </>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={sortDir}
              orderBy={sortColumn}
              headLabel={TABLE_HEAD}
              rowCount={(rows && rows.length > 0) ? rows.length : 0}
              numSelected={table.selected.length}
              onSort={(id: any, order: any) => {
                dispatch(listSlice.changeSort({ sortColumn: id, sortDir: (order === 'asc' ? 'desc' : 'asc') }));
                dispatch(listSlice.calReadApi(API));
              }}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  rows.map((row: any) => row.id)
                )
              }
              freeze
            />

            {(rows && rows.length > 0) && <TableBody>
              {rows
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row: any) => (
                  <ListRow
                    key={API + '_' + row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                emptyRows={emptyRows(table.page, table.rowsPerPage, rows.length)}
              />

              <TableNoData notFound={notFound} isLoading={isLoading} />
            </TableBody>}
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        sx={null}
        count={total}
        page={(isLoading || !(rows && rows.length > 0)) ? 0 : (currentPage-1)}
        rowsPerPage={pageSize}
        onPageChange={(e: any, newPage: number) => {
          dispatch(listSlice.changeCurrentPage((newPage+1)));
          dispatch(listSlice.calReadApi(API));
        }}
        onRowsPerPageChange={(e: any) => {
          const newPageSize = e.target.value;
          if(newPageSize){
            dispatch(listSlice.changeCurrentPage(1));
            dispatch(listSlice.changePageSize(newPageSize));
            dispatch(listSlice.calReadApi(API));
          }
        }}
        dense={null}
        onChangeDense={null}
      />
    </Card>

    <Form />

    <RemovePopup
      path={API}
      callback={async (item: any|null, msg: string|null, state: boolean|null, type: number, isBatch: boolean) => {
        table.onSelectAllRows(false);
        dispatch(listSlice.calStatsApi(API, searchQuery));

        if(type === RemoveAction.Activate){
          const newRows: any = updateRow(rows, item);
          dispatch(listSlice.changeRows(newRows));

        } else if(type === RemoveAction.Deactivate){
          const newRows: any = updateRow(rows, item);
          dispatch(listSlice.changeRows(newRows));

        } else {
          const newTotal = (item instanceof Array) ? (total - item.length) : (total - 1)
          const newRows: any = await removeRow(rows, item);
          dispatch(listSlice.changeRows(newRows));
          dispatch(listSlice.changeTotal(newTotal));
        }
      }}
    />
  </MainContainer>
}

export default List;
