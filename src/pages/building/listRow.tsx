/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
/* eslint-disable import/order */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';

// @mui
import {
  Stack,
  Avatar,
  Tooltip,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  ListItemText,
  Hidden,
  MenuItem,
} from '@mui/material';
import { grey } from '@mui/material/colors';

// components
import Label from 'src/components/label';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { dateTimeFormat } from '../../utils/utils.tsx';
import { RemoveAction } from '../../utils/enums.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice from './slice.tsx';
// import formSlice from '../../utils/slice/form/listSlice.tsx';
// import viewSlice from '../../utils/slice/form/viewSlice.tsx';
import removeSlice from '../../utils/slice/remove/removeSlice.tsx';
import { t } from 'i18next';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export default function ListRow({ row, isSelected, selected, onSelectRow }: any) {
  const popover = usePopover();

  // const listSlice = useTypedSelector((state: RootState) => state.listSlice);
  const dispatch = useDispatch<AppDispatch>();


  const onEditRow = () => {
    dispatch(slice.setShow({ show: true, id: row.id, payload: null }))
  }
  const onRemoveRow = () => {
    dispatch(removeSlice.show({ type: RemoveAction.Delete, params: null, title: t('deletePopup.title'), text: t('deletePopup.question'), btn: t('buttons.remove'), ids: row.id, isBatch: false }))
  }


  return (
    <TableRow hover selected={selected} id={'row_' + row.id}
      // style={{ cursor: 'pointer' }}
      // onClick={(e) => {
      //   e.stopPropagation();
      //   e.preventDefault();

      //   onViewRow();
      // }}
    >
      <TableCell padding="checkbox"
        sx={{
          whiteSpace: "nowrap",
          position: "sticky",
          left: 0,
          zIndex: 1,
        }}
      >
        <Checkbox checked={selected}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            onSelectRow(e);
          }}
        />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {
          (row?.logo)
          ?
          // <Avatar
          //   src={getUserLogo(row?.logo, VelicinaSlike.Mala)?.toString()}
          //   alt={row?.name}
          //   sx={{ mr: 2, bgcolor: grey[400] }}
          // >
          //   {row?.name.charAt(0).toUpperCase()}
          // </Avatar>
          <Avatar alt={row?.name} sx={{ mr: 2, bgcolor: grey[400] }}>{(row?.name && row?.name.length > 0) ? row?.name[0] : ''}</Avatar>
          :
          <Avatar alt={row?.name} sx={{ mr: 2, bgcolor: grey[400] }}>{(row?.name && row?.name.length > 0) ? row?.name[0] : ''}</Avatar>
        }

        <ListItemText
          primary={
            <Link
              component={RouterLink}
              to={`/building/${row.id}`}
              color="inherit"
              underline="hover"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {row?.name}
            </Link>
          }
          secondary={row?.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={row?.address}
          secondary={row?.city}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.city}</TableCell>

<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.units_number}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.pib}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.registration_number}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.bank_account}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.bank_ammount}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.area}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.year_of_construction}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.number_of_floors}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.number_of_elevators}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.roof_type}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.lightning_rod}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.shelter}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.remote_heating}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.parking}</TableCell>
<TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.description}</TableCell>
      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.country}</TableCell> */}

      <TableCell>
        <Label
          variant="soft"
          color={
            (row?.is_active && 'success') ||
            (!row?.is_active && 'error') ||
            'default'
          }
        >
          {row?.is_active ? t('buttons.active') : t('buttons.inactive')}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={(row?.created_at) ? format(new Date(row?.created_at), dateTimeFormat()) : ''}
          secondary={row?.updated_user_name}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="right"
        sx={{
          px: 1,
          whiteSpace: 'nowrap',
          position: "sticky",
          right: 0,
          zIndex: 1,
          backgroundColor: selected ? '#f5faf9' : 'white',
          borderLeft: '1px solid #F4F6F8',
        }}
      >
        <Hidden mdDown>
            <Tooltip title={t('buttons.edit')} placement="top" arrow>
              {/* <IconButton color={'default'}
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onEditRow()
                }}
              >
                <Icon icon={'solar:pen-bold'} />
              </IconButton> */}

                <IconButton
                  component={RouterLink}
                  to={`/building/${row.id}`}
                  color="default"
                  disabled={isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Icon icon={'solar:pen-bold'} />
                </IconButton>
            </Tooltip>

            <Tooltip title={t('buttons.remove')} placement="top" arrow>
              <IconButton color={'default'}
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onRemoveRow();
                }}
              >
                <Icon icon={'material-symbols:cancel'} />
              </IconButton>
            </Tooltip>
        </Hidden>

        <Hidden mdUp>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Icon icon={'eva:more-vertical-fill'} />
          </IconButton>
          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            arrow="right-top"
            sx={{ width: 150 }}
            hiddenArrow={undefined}
          >
            <MenuItem
              disabled={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                onEditRow()

                popover.onClose();
              }}
            >
              <>
                <Icon icon={'solar:pen-bold'} />
                {t('buttons.edit')}
              </>
            </MenuItem>

            <MenuItem
              disabled={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                onRemoveRow();

                popover.onClose();
              }}
            >
              <>
                <Icon icon={'material-symbols:cancel'} />
                {t('buttons.remove')}
              </>
            </MenuItem>

          </CustomPopover>
        </Hidden>
      </TableCell>
    </TableRow>
  );
}

ListRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  isSelected: PropTypes.bool,
  selected: PropTypes.bool
};
