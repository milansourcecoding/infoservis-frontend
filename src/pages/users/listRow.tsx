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
          backgroundColor: selected ? '#f5faf9' : 'white',
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
          primary={row?.name}
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
          primary={row?.city}
          secondary={row?.address}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.phone}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.jmbg}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {
            (row?.roles && row?.roles.length > 0)
            ?
            row?.roles.map((itm: any, i: number) => (<Label
              key={`roles_${i}`}
              variant="soft"
              color={'default'}
            >
              {itm}
            </Label>))
            :
            ''
          }
        </Stack>
      </TableCell>

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
          primary={(row?.registered_at) ? format(new Date(row?.registered_at), dateTimeFormat()) : ''}
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
              <IconButton color={'default'}
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onEditRow()
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
