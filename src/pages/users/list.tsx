/* eslint-disable no-lonely-if */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-fragments */
/* eslint-disable arrow-body-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/order */
/* eslint-disable prefer-template */
/* eslint-disable import/extensions */
import { useEffect, useState, useCallback } from 'react';

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
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { startOfWeek, endOfWeek } from 'date-fns'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { enGB } from 'date-fns/locale';

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
import BasicSearchToolbar from '../../components/toolbar/basicSearchToolbar.tsx';
import BasicTabsToolbar from '../../components/toolbar/basicTabsToolbar.tsx';

// components
import MainContainer from 'src/components/container/MainContainer.tsx';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/index.js';
import Label from 'src/components/label/index.js';
import Scrollbar from 'src/components/scrollbar/index.js';

import Form from './form.tsx';

import { removeRow, createRow, updateRow, downloadPDF, viewPDF, downloadCSV } from '../../utils/utils.tsx';
import { RoleType, RemoveAction } from '../../utils/enums.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice, { API, LANGUAGE, getFields, getFilterOptions } from './slice.tsx';
import listSlice from '../../utils/slice/form/listSlice.tsx';
import removeSlice from '../../utils/slice/remove/removeSlice.tsx';
import RemovePopup from '../../utils/slice/remove/removePopup.tsx';

// ----------------------------------------------------------------------

const List = () => {
  const { t } = useLocales();

  const DEFAULT_FILTER = 1;
  const MAIN_STATUS = 'active';

  const TABLE_HEAD = [
    { id: 'name', label: getFields(t, 'name')?.label },
    { id: 'address', label: getFields(t, 'address')?.label },
    { id: 'phone', label: getFields(t, 'phone')?.label },
    { id: 'jmbg', label: getFields(t, 'jmbg')?.label },
    { id: 'roles', label: getFields(t, 'roles')?.label, disableSort: true },
    { id: 'isActive', label: getFields(t, 'is_active')?.label },
    { id: 'registered_at', label: t('table.registered_at'), width: 180, disableSort: true },
    { id: '', width: 50 },
  ];

  const defaultFilters = {
    name: '',
    role: [],
    status: MAIN_STATUS,
  };

  const { isLoading, rows, total, page, per_page, sortColumn, sortDir, search, stats, customField, from, to } = useTypedSelector((state: RootState) => state.listSlice);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    dispatch(listSlice.changeIsActive(DEFAULT_FILTER));
    // dispatch(listSlice.calStatsApi(API, search));
    const statsData = [
      { value: 'all', label: 'All', count: 1 },
      { value: 'active', label: 'Active', count: 1 },
      { value: 'inactive', label: 'Inactive', count: 1 },
    ];
    dispatch(listSlice.finishStats({ data: statsData, msg: '', state: true}));
    dispatch(listSlice.calReadApi(API));

    return () => {
      dispatch(listSlice.resetForm());
    }
  }, []);


  const table = useTable();
  const [filters, setFilters] = useState(defaultFilters);
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!(rows && rows.length > 0) && canReset) || !(rows && rows.length > 0);


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

      const isActive = (value === 'all') ? null : (value === 'active') ? 1 : 0;
      dispatch(listSlice.changeIsActive(isActive));

      dispatch(listSlice.calReadApi(API));
    },
    [table]
  );


  const extraFilterComponent = () => {
    return <FormControl fullWidth>
      <Select
        size={'small'}
        value={customField ?? 'all'}
        placeholder={t('status.all')}
        renderValue={(selected) => (selected !== 'all') ? selected : t('status.all')}
        onChange={(e: any) => {
          const value = e.target.value;

          dispatch(listSlice.changePage(1));
          dispatch(listSlice.changeCustomField({ customField: value, customFieldValue: ((value != '') ? search : null) }));
          dispatch(listSlice.calReadApi(API));
          // dispatch(listSlice.calStatsApi(API, search));
        }}
      >
        <MenuItem value={'all'}>{t('status.all')}</MenuItem>

        {getFilterOptions(t).map((itm: any, i: number) => {
          return <MenuItem key={'filter_option_' + i} value={itm?.id}>{itm?.label}</MenuItem>
        })}
      </Select>
    </FormControl>
  }


  return <MainContainer title={t(LANGUAGE + '.title')} roles={Object.values(RoleType)}>
    <CustomBreadcrumbs
      heading={t(LANGUAGE + '.list')}
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
            dispatch(listSlice.changeIsActive(null));
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
                color={
                  (tab.value === 'active' && 'success') ||
                  (tab.value === 'inactive' && 'error') ||
                  'default'
                }
              >
                {tab.value === 'all' && tab.count}
                {tab.value === 'active' && tab.count}
                {tab.value === 'inactive' && tab.count}
              </Label>
            }
          />
        ))}
      </Tabs>

      <BasicSearchToolbar
        path={API}
        title={t(LANGUAGE + '.title')}
        onSearch={(searchValue: any) => {
          dispatch(listSlice.changePage(1));
          dispatch(listSlice.changeSearch(searchValue));
          if(searchValue === ''){
            dispatch(listSlice.changeCustomField({ customField, customFieldValue: ((customField != '') ? '' : null) }));
          }
          dispatch(listSlice.calReadApi(API));
          // dispatch(listSlice.calStatsApi(API, searchValue));
        }}
        extraFilterComponent={extraFilterComponent()}
      />

      {canReset && (
        <BasicTabsToolbar
          mainStatus={MAIN_STATUS}
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={() => {
            setFilters(defaultFilters);

            dispatch(listSlice.changeIsActive(DEFAULT_FILTER));
            dispatch(listSlice.changeSearch(null));
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
              <Tooltip title={t('buttons.deactivate')}>
                <IconButton color="primary" onClick={() => {
                  const text = `${t('deactivatePopup.questionBatch1')} ${table.selected.length} ${t('deactivatePopup.questionBatch2')}`;
                  const btn = `${t('buttons.deactivate')}`;
                  const ids = table.selected.join(',');
                  dispatch(removeSlice.show({ type: RemoveAction.Deactivate, params: { ids, isActive: false }, title: t('deactivatePopup.title'), text, btn, ids, isBatch: true }))
                }}>
                  <Icon icon={'fluent:checkbox-unchecked-16-filled'} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('buttons.activate')}>
                <IconButton color="primary" onClick={() => {
                  const text = `${t('activatePopup.questionBatch1')} ${table.selected.length} ${t('activatePopup.questionBatch2')}`;
                  const btn = `${t('buttons.activate')}`;
                  const ids = table.selected.join(',');
                  dispatch(removeSlice.show({ type: RemoveAction.Activate, params: { ids, isActive: true }, title: t('activatePopup.title'), text, btn, ids, isBatch: true }))
                }}>
                  <Icon icon={'fluent:checkbox-checked-16-filled'} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('buttons.remove')}>
                <IconButton color="primary" onClick={() => {
                  const text = `${t('deletePopup.questionBatch1')} ${table.selected.length} ${t('deletePopup.questionBatch2')}`;
                  const btn = `${t('buttons.remove')}`;
                  const ids = table.selected.join(',');
                  dispatch(removeSlice.show({ type: RemoveAction.Delete, params: { ids }, title: t('deletePopup.title'), text, btn, ids, isBatch: true }))
                }}>
                  <Icon icon={'solar:trash-bin-trash-bold'} />
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

            {
            (rows && rows.length > 0)
            ?
            <TableBody>
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
            </TableBody>
            :
            <TableBody>
              <TableEmptyRows
                emptyRows={emptyRows(table.page, table.rowsPerPage, rows.length)}
              />

              <TableNoData notFound={notFound} isLoading={isLoading} />
            </TableBody>
            }
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        sx={null}
        count={total}
        page={(isLoading || !(rows && rows.length > 0)) ? 0 : (page-1)}
        rowsPerPage={per_page}
        onPageChange={(e: any, newPage: number) => {
          dispatch(listSlice.changePage((newPage+1)));
          dispatch(listSlice.calReadApi(API));
        }}
        onRowsPerPageChange={(e: any) => {
          const newPerPage = e.target.value;
          if(newPerPage){
            dispatch(listSlice.changePage(1));
            dispatch(listSlice.changePerPage(newPerPage));
            dispatch(listSlice.calReadApi(API));
          }
        }}
        dense={null}
        onChangeDense={null}
      />
    </Card>

    <Form
      onCreate={(data: any) => {
        const newRows: any = createRow(rows, data);
        const newTotal = (total + 1)

        dispatch(listSlice.changeRows(newRows));
        dispatch(listSlice.changeTotal(newTotal));
        // dispatch(listSlice.calStatsApi(API, search));
      }}
      onUpdate={(data: any) => {
        const newRows: any = updateRow(rows, data);
        dispatch(listSlice.changeRows(newRows));
        // dispatch(listSlice.calStatsApi(API, search));
      }}
    />

    <RemovePopup
      path={API}
      callback={async (item: any|null, msg: string|null, state: boolean|null, type: number, isBatch: boolean) => {
        table.onSelectAllRows(false);
        // dispatch(listSlice.calStatsApi(API, search));

        if(type === RemoveAction.Activate){
          const newRows: any = updateRow(rows, item);
          dispatch(listSlice.changeRows(newRows));

        } else if(type === RemoveAction.Deactivate){
          const newRows: any = updateRow(rows, item);
          dispatch(listSlice.changeRows(newRows));

        } else {
          if(isBatch){
            dispatch(listSlice.changePage(1));
            dispatch(listSlice.calReadApi(API));
          } else {
            const newTotal = (item instanceof Array) ? (total - item.length) : (total - 1)
            const newRows: any = await removeRow(rows, item);
            dispatch(listSlice.changeRows(newRows));
            dispatch(listSlice.changeTotal(newTotal));
          }
        }
      }}
    />
  </MainContainer>
}

export default List;
